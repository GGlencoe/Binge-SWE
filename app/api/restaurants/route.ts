import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import type { Restaurant } from '@/types/database'

type FreqMap = Record<string, number>

function buildFreqMap(items: { cuisine_type: string[] | null }[]): FreqMap {
  const freq: FreqMap = {}
  for (const item of items) {
    for (const c of item.cuisine_type ?? []) freq[c] = (freq[c] ?? 0) + 1
  }
  return freq
}

function score(r: Restaurant, likeFreq: FreqMap, skipFreq: FreqMap): number {
  const likeScore = (r.cuisine_type ?? []).reduce((s, c) => s + Math.pow(likeFreq[c] ?? 0, 2), 0)
  const penalty   = (r.cuisine_type ?? []).reduce((s, c) => s + Math.pow(skipFreq[c] ?? 0, 2), 0)
  return likeScore - penalty
}

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20)))

  // ── 1. Build like/skip frequency maps ────────────────────────────────────
  const { data: allSwipes } = await auth.supabase
    .from('restaurantswipes')
    .select('restaurant_id, direction')
    .eq('user_id', auth.user.id)

  const likedIds   = (allSwipes ?? []).filter((s: { direction: string }) => s.direction === 'like' || s.direction === 'super_like').map((s: { restaurant_id: string }) => s.restaurant_id)
  const skippedIds = (allSwipes ?? []).filter((s: { direction: string }) => s.direction === 'skip').map((s: { restaurant_id: string }) => s.restaurant_id)
  const excludeIds = (allSwipes ?? []).map((s: { restaurant_id: string }) => s.restaurant_id)

  let likeFreq: FreqMap = {}, skipFreq: FreqMap = {}

  if (likedIds.length > 0) {
    const { data } = await auth.supabase.from('restaurants').select('cuisine_type').in('id', likedIds)
    likeFreq = buildFreqMap(data ?? [])
  }
  if (skippedIds.length > 0) {
    const { data } = await auth.supabase.from('restaurants').select('cuisine_type').in('id', skippedIds)
    skipFreq = buildFreqMap(data ?? [])
  }

  // ── 2. Fetch unseen restaurants ──────────────────────────────────────────
  let query = auth.supabase.from('restaurants').select('*')
  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`)
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const restaurants = (data ?? []) as Restaurant[]
  const hasHistory = Object.keys(likeFreq).length > 0

  // ── 3. Score and sort ────────────────────────────────────────────────────
  const scored = restaurants.map((r) => ({
    ...r,
    _score: hasHistory ? score(r, likeFreq, skipFreq) : r.rating ?? 0,
  }))

  scored.sort((a, b) => b._score - a._score)

  // ── 4. 90/10 split ───────────────────────────────────────────────────────
  const splitIdx = Math.ceil(scored.length * 0.9)
  const mainPool    = scored.slice(0, splitIdx).sort(() => Math.random() - 0.5)
  const wildcardPool = scored.slice(splitIdx)

  const numWildcards = Math.max(1, Math.floor(limit * 0.1))
  const numMain = limit - numWildcards

  const result = [
    ...mainPool.slice(0, numMain),
    ...wildcardPool.slice(0, numWildcards),
  ].sort(() => Math.random() - 0.5)

  return NextResponse.json({ data: result })
}
