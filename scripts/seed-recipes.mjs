/**
 * Daily seed script: fetches recipes from Spoonacular and upserts into the Supabase foods table.
 * Safe to run multiple times — duplicates are ignored via external_id conflict.
 * Each run uses sort=random so you get a fresh batch every day.
 *
 * Cost: 9 cuisines × (1 base + 10 recipes) = ~99 Spoonacular points per run.
 * Free tier allows 150 points/day — run once daily to build up the recipe library.
 *
 * Usage:
 *   npm run seed-recipes           — fetch and insert
 *   npm run seed-recipes -- --dry-run  — preview without writing to DB
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const MAX_RECIPES = parseInt(process.env.SEED_MAX ?? '500', 10)

// Manual .env.local parsing — works on all shells/OSes regardless of --env-file support
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // --env-file already loaded them, or .env.local not found — continue
  }
}
loadEnv()

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SPOONACULAR_KEY   = process.env.SPOONACULAR_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SPOONACULAR_KEY) {
  console.error('\nMissing env vars:')
  if (!SUPABASE_URL)          console.error('  NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY)  console.error('  SUPABASE_SERVICE_ROLE_KEY')
  if (!SPOONACULAR_KEY)       console.error('  SPOONACULAR_API_KEY')
  console.error('\nMake sure these are in .env.local\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Rotates through 3 groups of 3 cuisines daily.
// Each run: 3 cuisines × (1 search + 15 recipes) = 48 points — fits free tier (50/day).
// All 9 cuisines covered every 3 days, yielding 45 recipes/run vs 36 with a flat approach.
const CUISINE_GROUPS = [
  ['Italian', 'Mexican', 'American'],
  ['Indian', 'Japanese', 'Chinese'],
  ['Thai', 'Mediterranean', 'French'],
]
const dayIndex = Math.floor(Date.now() / 86_400_000) // days since epoch
const CUISINES = CUISINE_GROUPS[dayIndex % 3]
const PER_CUISINE = 15

function stripHtml(html) {
  return (html ?? '').replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function toPriceRange(cents) {
  if (!cents) return null
  if (cents < 200)  return 1
  if (cents < 500)  return 2
  if (cents < 1000) return 3
  return 4
}

function toRating(score) {
  if (!score) return null
  return Math.round((score / 20) * 100) / 100
}

async function fetchCuisine(cuisine) {
  const url = new URL('https://api.spoonacular.com/recipes/complexSearch')
  url.searchParams.set('cuisine', cuisine)
  url.searchParams.set('number', String(PER_CUISINE))
  url.searchParams.set('addRecipeInformation', 'true')
  url.searchParams.set('addRecipeNutrition', 'false')
  url.searchParams.set('sort', 'random')   // different results every run
  url.searchParams.set('apiKey', SPOONACULAR_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`  ✗ ${res.status} for ${cuisine}: ${body.slice(0, 120)}`)
    return []
  }
  const json = await res.json()
  if (json.code && json.code !== 200) {
    console.error(`  ✗ API error for ${cuisine}: ${json.message}`)
    return []
  }
  return json.results ?? []
}

function toRow(recipe) {
  return {
    external_id:  `spoonacular_${recipe.id}`,
    type:         'recipe',
    name:         recipe.title,
    description:  stripHtml(recipe.summary ?? '').slice(0, 500) || null,
    image_url:    recipe.image ?? null,
    cuisine_type: recipe.cuisines?.length  ? recipe.cuisines : [],
    dietary_tags: recipe.diets?.length     ? recipe.diets    : [],
    price_range:  toPriceRange(recipe.pricePerServing),
    rating:       toRating(recipe.spoonacularScore),
    location:     null,
    metadata:     {},
  }
}

async function main() {
  if (DRY_RUN) console.log('DRY RUN — nothing will be written to the database.\n')

  // Check how many spoonacular recipes already exist to avoid wasting API points
  const { count, error: countError } = await supabase
    .from('foods')
    .select('*', { count: 'exact', head: true })
    .like('external_id', 'spoonacular_%')

  if (countError) {
    console.error('Could not query existing recipe count:', countError.message)
  } else {
    console.log(`Existing Spoonacular recipes in DB: ${count}`)
    if (!DRY_RUN && count >= MAX_RECIPES) {
      console.log(`DB already has ${count} recipes (max: ${MAX_RECIPES}). Nothing to do.`)
      console.log('Set SEED_MAX env var higher to seed more, e.g. SEED_MAX=1000 npm run seed-recipes')
      return
    }
  }

  console.log('Fetching recipes from Spoonacular...\n')

  const allRows = []
  const seenIds = new Set()

  for (const cuisine of CUISINES) {
    process.stdout.write(`  ${cuisine.padEnd(14)}`)
    const results = await fetchCuisine(cuisine)
    let added = 0
    for (const r of results) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id)
        allRows.push(toRow(r))
        added++
      }
    }
    console.log(`${added} recipes`)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nTotal: ${allRows.length} recipes`)

  if (DRY_RUN) {
    console.log('\nSample (first 3):')
    allRows.slice(0, 3).forEach(r => console.log(`  • ${r.name} [${r.cuisine_type.join(', ')}]`))
    console.log('\nDry run complete — run without --dry-run to insert.')
    return
  }

  console.log('Upserting into Supabase...')
  const { error } = await supabase
    .from('foods')
    .upsert(allRows, { onConflict: 'external_id' })

  if (error) {
    console.error('\nSupabase error:', error.message)
    process.exit(1)
  }

  console.log('Done! Run again tomorrow for a fresh batch.')
}

main()
