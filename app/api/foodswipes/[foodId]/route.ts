import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ foodId: string }> }
) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { foodId } = await params

  const { error } = await auth.supabase
    .from('foodswipes')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('food_id', foodId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
