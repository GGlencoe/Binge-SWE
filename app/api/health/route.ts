import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ ok: false, error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' }, { status: 500 })
  }

  try {
    const supabase = createClient(url, key)
    const { error } = await supabase.from('profiles').select('id').limit(1)

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ ok: false, error: error.message, hint: error.hint ?? null }, { status: 500 })
    }

    return NextResponse.json({ ok: true, url })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
