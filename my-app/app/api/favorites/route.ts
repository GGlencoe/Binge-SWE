import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { data, error } = await auth.supabase
    .from('favorites')
    .select('*, foods(*)')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { food_id } = await request.json()

  if (!food_id) {
    return NextResponse.json({ error: 'food_id is required' }, { status: 400 })
  }

  const { data, error } = await auth.supabase
    .from('favorites')
    .upsert({ user_id: auth.user.id, food_id }, { onConflict: 'user_id,food_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
