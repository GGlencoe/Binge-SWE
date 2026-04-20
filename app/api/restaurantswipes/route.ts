import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import type { SwipeDirection } from '@/types/database'

export async function POST(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { restaurant_id, direction } = await request.json() as { restaurant_id: string; direction: SwipeDirection }

  if (!restaurant_id || !direction) {
    return NextResponse.json({ error: 'restaurant_id and direction are required' }, { status: 400 })
  }

  const { data: swipe, error } = await auth.supabase
    .from('restaurantswipes')
    .upsert({ user_id: auth.user.id, restaurant_id, direction }, { onConflict: 'user_id,restaurant_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: swipe }, { status: 201 })
}

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const from = (page - 1) * limit

  const { data, error, count } = await auth.supabase
    .from('restaurantswipes')
    .select('*, restaurants(*)', { count: 'exact' })
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}
