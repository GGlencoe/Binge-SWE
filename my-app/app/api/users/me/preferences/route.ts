import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { data, error } = await auth.supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', auth.user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? null })
}

export async function PUT(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { dietary_restrictions, allergies, cuisine_interests, price_range, max_distance_miles } =
    await request.json()

  const { data, error } = await auth.supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: auth.user.id,
        dietary_restrictions,
        allergies,
        cuisine_interests,
        price_range,
        max_distance_miles,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
