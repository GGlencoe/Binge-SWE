import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { SavedType, SwipeableItem } from '@/types/database'

export async function POST(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is missing. Please add GOOGLE_GEMINI_API_KEY to your .env file.' },
      { status: 500 }
    )
  }

  const { craving, type, source } = await request.json() as {
    craving: string
    type: SavedType
    source: 'liked' | 'saved'
  }

  if (!craving) {
    return NextResponse.json({ error: 'Craving is required' }, { status: 400 })
  }

  // 1. Fetch items
  let items: SwipeableItem[] = []
  if (source === 'liked') {
    const table = type === 'food' ? 'foodswipes' : 'restaurantswipes'
    const select = type === 'food' ? '*, foods(*)' : '*, restaurants(*)'
    const { data, error } = await auth.supabase
      .from(table)
      .select(select)
      .eq('user_id', auth.user.id)
      .in('direction', ['like', 'super_like'])
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    items = (data ?? []).map(d => type === 'food' ? d.foods : d.restaurants).filter(Boolean)
  } else {
    const select = type === 'food' ? '*, foods(*)' : '*, restaurants(*)'
    const { data, error } = await auth.supabase
      .from('saved')
      .select(select)
      .eq('user_id', auth.user.id)
      .eq('type', type)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    items = (data ?? []).map(d => type === 'food' ? d.foods : d.restaurants).filter(Boolean)
  }

  if (items.length === 0) {
    return NextResponse.json({ error: `No ${type}s found in your ${source} list.` }, { status: 400 })
  }

  // 2. Prepare prompt
  const itemsContext = items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    cuisine: item.cuisine_type?.join(', '),
    tags: item.dietary_tags?.join(', ')
  }))

  const prompt = `
    User's craving: "${craving}"
    List of ${type}s the user has ${source}:
    ${JSON.stringify(itemsContext, null, 2)}

    Based on the craving, recommend the top 3 items from the list above that best match what the user wants.
    Return the response as a JSON object with a single key "recommendations" which is an array of objects.
    Each object should have "id" (from the list) and "reason" (why this matches).
    Be helpful and encouraging.
    
    Response format:
    {
      "recommendations": [
        { "id": "...", "reason": "..." },
        ...
      ]
    }
  `

  // 3. Call Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response (Gemini sometimes wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }
    
    const recommendations = JSON.parse(jsonMatch[0])
    
    // Attach full item data to recommendations
    const enrichedRecommendations = recommendations.recommendations.map((rec: { id: string; reason: string }) => {
      const fullItem = items.find(i => i.id === rec.id)
      return {
        ...rec,
        item: fullItem
      }
    }).filter((r: { id: string; reason: string; item?: SwipeableItem }) => r.item)

    return NextResponse.json({ recommendations: enrichedRecommendations })
  } catch (error: unknown) {
    console.error('Gemini Error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to generate recommendations: ' + message }, { status: 500 })
  }
}
