import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { data, error } = await auth.supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { username, display_name, avatar_url, location } = await request.json()

  const { data, error } = await auth.supabase
    .from('profiles')
    .update({ username, display_name, avatar_url, location, updated_at: new Date().toISOString() })
    .eq('id', auth.user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
