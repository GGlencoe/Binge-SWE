import { NextResponse } from 'next/server'
import { SwipeableItem } from '@/types/database'
import { createClient } from '@supabase/supabase-js'
import { requireUser } from '@/lib/auth'
import crypto from 'crypto'

function generateDeterministicUUID(str: string) {
  const hash = crypto.createHash('sha256').update(str).digest('hex')
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  types?: string[]
  photos?: Array<{ photo_reference: string }>
  price_level?: number
  rating?: number
  geometry?: {
    location?: {
      lat: number
      lng: number
    }
  }
  user_ratings_total?: number
}

const FOOD_KEYWORDS = [
  'american', 'mexican', 'italian', 'chinese', 'japanese', 'thai', 'indian', 'korean', 'mediterranean',
  'burgers', 'fries', 'nachos', 'pizza', 'ice cream', 'coffee', 'steak', 'breakfast', 'brunch',
  'sushi', 'tacos', 'salad', 'sandwiches', 'bbq', 'seafood', 'vegan', 'vegetarian', 'dessert', 'cocktails', 'wine', 'beer'
];

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key is missing' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  let query = searchParams.get('query')
  if (!query || query === 'restaurants') {
    query = FOOD_KEYWORDS[Math.floor(Math.random() * FOOD_KEYWORDS.length)] + ' restaurants'
  }

  // Use Text Search API to easily get restaurants
  const googleApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=restaurant&key=${apiKey}`

  try {
    const res = await fetch(googleApiUrl)
    const json = await res.json()

    if (!res.ok || json.status === 'REQUEST_DENIED' || json.error_message) {
      return NextResponse.json({ error: json.error_message || 'Error fetching places' }, { status: 500 })
    }

    // Limit to 10 results to keep concurrent details fetching fast
    let results = json.results || []
    results = results.slice(0, 10)

    // Fetch details concurrently for description and custom keyword extraction
    const detailedResults = await Promise.all(results.map(async (place: GooglePlace) => {
      try {
        const dres = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=editorial_summary,reviews&key=${apiKey}`)
        const djson = await dres.json()
        return { place, detail: djson.result || {} }
      } catch {
        return { place, detail: {} }
      }
    }))

    const processedData: SwipeableItem[] = detailedResults.map(({ place, detail }) => {
      // Map Google photos to URL
      let imageUrl = null
      if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].photo_reference
        imageUrl = `/api/photo?ref=${photoRef}&maxwidth=800`
      }

      // Concatenate summary and reviews to extract keywords
      const textBlob = [
        detail.editorial_summary?.overview || '',
        ...(detail.reviews || []).map((r: { text: string }) => r.text)
      ].join(' ').toLowerCase()

      const matchedTags = FOOD_KEYWORDS.filter(kw => textBlob.includes(kw))

      // Convert Google types to tags as a fallback
      const fallbackTags = (place.types || [])
        .filter((t: string) => t !== 'point_of_interest' && t !== 'establishment')
        .map((t: string) => t.replace(/_/g, ' '))
        .slice(0, 3)

      const tags = matchedTags.length > 0
        ? matchedTags.slice(0, 3).map((kw: string) => kw.charAt(0).toUpperCase() + kw.slice(1))
        : fallbackTags

      const id = generateDeterministicUUID(place.place_id)

      return {
        id,
        external_id: place.place_id,
        name: place.name,
        // Fallback to null if no description exists, removing the raw location address from the text box
        description: detail.editorial_summary?.overview || null,
        image_url: imageUrl,
        cuisine_type: tags,
        dietary_tags: [],
        price_range: place.price_level || null,
        rating: place.rating || null,
        location: {
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng,
          address: place.formatted_address
        },
        metadata: {
          user_ratings_total: place.user_ratings_total
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    // Upsert to DB so foreign keys for swipes work using the Service Role Key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabaseAdmin
      .from('restaurants')
      .upsert(processedData.map(p => ({
        id: p.id,
        external_id: p.external_id,
        name: p.name,
        description: p.description,
        image_url: p.image_url,
        cuisine_type: p.cuisine_type,
        dietary_tags: p.dietary_tags,
        price_range: p.price_range,
        rating: p.rating,
        location: p.location,
        metadata: p.metadata
      })), { onConflict: 'id' })

    if (dbError) {
      console.error("Error upserting restaurants:", dbError.message)
    }

    // Filter out already swiped ones
    const { data: allSwipes } = await auth.supabase
      .from('restaurantswipes')
      .select('restaurant_id')
      .eq('user_id', auth.user.id)
      .in('restaurant_id', processedData.map(p => p.id))

    const swipedIds = new Set((allSwipes ?? []).map(s => s.restaurant_id))
    const unswipedData = processedData.filter(p => !swipedIds.has(p.id))

    // Fallback if all were somehow already swiped
    const finalData = unswipedData.length > 0 ? unswipedData : processedData;

    return NextResponse.json({ data: finalData })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
