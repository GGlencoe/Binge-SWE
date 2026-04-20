import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { id } = await params

  const { error } = await auth.supabase
    .from('saved')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
