import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)))

  const { data: prefs } = await auth.supabase
    .from('user_preferences')
    .select('cuisine_interests, price_range')
    .eq('user_id', auth.user.id)
    .single()

  const { data: swipedIds } = await auth.supabase
    .from('swipes')
    .select('food_id')
    .eq('user_id', auth.user.id)

  const excludeIds = (swipedIds ?? []).map((s: { food_id: string }) => s.food_id)

  let query = auth.supabase
    .from('foods')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit)

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  if (prefs?.cuisine_interests?.length) {
    query = query.overlaps('cuisine_type', prefs.cuisine_interests)
  }

  if (prefs?.price_range) {
    query = query.lte('price_range', prefs.price_range)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
