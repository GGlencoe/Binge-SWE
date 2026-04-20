import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import type { SavedType } from '@/types/database'

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const type = (searchParams.get('type') ?? 'food') as SavedType

  if (type === 'food') {
    const { data, error } = await auth.supabase
      .from('foodswipes')
      .select('*, foods(*)')
      .eq('user_id', auth.user.id)
      .in('direction', ['like', 'super_like'])
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  }

  const { data, error } = await auth.supabase
    .from('restaurantswipes')
    .select('*, restaurants(*)')
    .eq('user_id', auth.user.id)
    .in('direction', ['like', 'super_like'])
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
