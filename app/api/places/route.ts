import { NextResponse } from 'next/server'
import { Food } from '@/types/database'

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
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key is missing' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'restaurants'
  
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

    const processedData: Food[] = detailedResults.map(({ place, detail }) => {
      // Map Google photos to URL
      let imageUrl = null
      if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].photo_reference
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`
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

      return {
        id: place.place_id,
        external_id: place.place_id,
        type: 'restaurant',
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

    return NextResponse.json({ data: processedData })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
