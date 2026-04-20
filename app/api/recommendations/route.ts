import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import type { Food } from '@/types/database'

type FreqMap = Record<string, number>

function buildFreqMap(items: { cuisine_type: string[] | null; dietary_tags: string[] | null }[]): {
  cuisineFreq: FreqMap
  tagFreq: FreqMap
} {
  const cuisineFreq: FreqMap = {}
  const tagFreq: FreqMap = {}
  for (const item of items) {
    for (const c of item.cuisine_type ?? []) cuisineFreq[c] = (cuisineFreq[c] ?? 0) + 1
    for (const t of item.dietary_tags ?? []) tagFreq[t] = (tagFreq[t] ?? 0) + 1
  }
  return { cuisineFreq, tagFreq }
}

function score(food: Food, likeFreq: FreqMap, likeTagFreq: FreqMap, skipFreq: FreqMap): number {
  const likeScore =
    (food.cuisine_type ?? []).reduce((s, c) => s + Math.pow(likeFreq[c] ?? 0, 2), 0) +
    (food.dietary_tags ?? []).reduce((s, t) => s + Math.pow(likeTagFreq[t] ?? 0, 2), 0)
  const penalty =
    (food.cuisine_type ?? []).reduce((s, c) => s + Math.pow(skipFreq[c] ?? 0, 2), 0)
  return likeScore - penalty
}

export async function GET(request: Request) {
  const auth = await requireUser()
  if (auth.unauthorized) return auth.unauthorized

  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20)))

  // ── 1. Build like/skip frequency maps from swipe history ─────────────────
  const { data: allSwipes } = await auth.supabase
    .from('foodswipes')
    .select('food_id, direction')
    .eq('user_id', auth.user.id)

  const likedIds   = (allSwipes ?? []).filter((s: { direction: string }) => ['like', 'super_like'].includes(s.direction)).map((s: { food_id: string }) => s.food_id)
  const skippedIds = (allSwipes ?? []).filter((s: { direction: string }) => s.direction === 'skip').map((s: { food_id: string }) => s.food_id)
  const excludeIds = (allSwipes ?? []).map((s: { food_id: string }) => s.food_id)

  let likeFreq: FreqMap = {}, likeTagFreq: FreqMap = {}, skipFreq: FreqMap = {}

  if (likedIds.length > 0) {
    const { data: likedFoods } = await auth.supabase
      .from('foods').select('cuisine_type, dietary_tags').in('id', likedIds)
    const maps = buildFreqMap(likedFoods ?? [])
    likeFreq    = maps.cuisineFreq
    likeTagFreq = maps.tagFreq
  }

  if (skippedIds.length > 0) {
    const { data: skippedFoods } = await auth.supabase
      .from('foods').select('cuisine_type, dietary_tags').in('id', skippedIds)
    skipFreq = buildFreqMap(skippedFoods ?? []).cuisineFreq
  }

  // ── 2. Fetch unseen foods from DB (always — no live API calls here) ───────
  let query = auth.supabase.from('foods').select('*')
  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`)
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const foods = (data ?? []) as Food[]
  const hasHistory = Object.keys(likeFreq).length > 0

  // ── 3. Score and sort ────────────────────────────────────────────────────
  const scored = foods.map((food) => ({
    ...food,
    _score: hasHistory ? score(food, likeFreq, likeTagFreq, skipFreq) : food.rating ?? 0,
  }))

  scored.sort((a, b) => b._score - a._score)

  // ── 4. 90/10 split — personalized picks + lowest-scored wildcards ─────────
  const splitIdx     = Math.ceil(scored.length * 0.9)
  const mainPool     = scored.slice(0, splitIdx).sort(() => Math.random() - 0.5)
  const wildcardPool = scored.slice(splitIdx)

  const numWildcards = Math.max(1, Math.floor(limit * 0.1))
  const numMain      = limit - numWildcards

  const result = [
    ...mainPool.slice(0, numMain),
    ...wildcardPool.slice(0, numWildcards),
  ].sort(() => Math.random() - 0.5)

  return NextResponse.json({ data: result })
}
