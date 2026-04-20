import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import type { SavedType } from '@/types/database'

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const type = (searchParams.get('type') ?? 'food') as SavedType

  const selectJoin = type === 'food' ? '*, foods(*)' : '*, restaurants(*)'

  const { data, error } = await auth.supabase
    .from('saved')
    .select(selectJoin)
    .eq('user_id', auth.user.id)
    .eq('type', type)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { item_id, type } = await request.json() as { item_id: string; type: SavedType }

  if (!item_id || !type) {
    return NextResponse.json({ error: 'item_id and type are required' }, { status: 400 })
  }

  const idColumn = type === 'food' ? 'food_id' : 'restaurant_id'

  // Check if already saved (avoids partial-index upsert conflict issues)
  const { data: existing } = await auth.supabase
    .from('saved')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('type', type)
    .eq(idColumn, item_id)
    .maybeSingle()

  if (existing) return NextResponse.json({ data: existing })

  const row =
    type === 'food'
      ? { user_id: auth.user.id, type, food_id: item_id, restaurant_id: null }
      : { user_id: auth.user.id, type, restaurant_id: item_id, food_id: null }

  const { data, error } = await auth.supabase
    .from('saved')
    .insert(row)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
