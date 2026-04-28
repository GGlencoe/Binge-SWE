import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')
  const maxwidth = searchParams.get('maxwidth') ?? '800'

  if (!ref) {
    return NextResponse.json({ error: 'Missing photo reference' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key is missing' }, { status: 500 })
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${apiKey}`

  const res = await fetch(googleUrl)

  if (!res.ok) {
    return new NextResponse('Failed to fetch photo', { status: res.status })
  }

  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  const buffer = await res.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
