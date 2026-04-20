// Valid Spoonacular cuisine values — 'Asian' is NOT valid, use specific ones
export const SPOONACULAR_CUISINES = [
  'Italian', 'Mexican', 'American', 'Indian',
  'Japanese', 'Chinese', 'Thai', 'Mediterranean', 'French',
] as const

export type SpoonacularRecipe = {
  id: number
  title: string
  image: string
  summary?: string
  cuisines: string[]
  diets: string[]
  pricePerServing?: number
  spoonacularScore?: number
}

function stripHtml(html: string) {
  return (html ?? '').replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function toPriceRange(cents: number | null | undefined): number | null {
  if (!cents) return null
  if (cents < 200) return 1
  if (cents < 500) return 2
  if (cents < 1000) return 3
  return 4
}

function toRating(score: number | null | undefined): number | null {
  if (!score) return null
  return Math.round((score / 20) * 100) / 100
}

export function toFoodRow(recipe: SpoonacularRecipe) {
  return {
    external_id: `spoonacular_${recipe.id}`,
    type: 'recipe' as const,
    name: recipe.title,
    description: stripHtml(recipe.summary ?? '').slice(0, 500) || null,
    image_url: recipe.image ?? null,
    cuisine_type: recipe.cuisines?.length ? recipe.cuisines : [],
    dietary_tags: recipe.diets?.length ? recipe.diets : [],
    price_range: toPriceRange(recipe.pricePerServing),
    rating: toRating(recipe.spoonacularScore),
    location: null,
    metadata: {} as Record<string, unknown>,
  }
}

export async function fetchRecipesByCuisines(
  cuisines: string[],
  perCuisine = 10
): Promise<SpoonacularRecipe[]> {
  const key = process.env.SPOONACULAR_API_KEY
  if (!key) throw new Error('SPOONACULAR_API_KEY not set')

  const seen = new Set<number>()
  const results: SpoonacularRecipe[] = []

  for (const cuisine of cuisines) {
    const url = new URL('https://api.spoonacular.com/recipes/complexSearch')
    url.searchParams.set('cuisine', cuisine)
    url.searchParams.set('number', String(perCuisine))
    url.searchParams.set('addRecipeInformation', 'true')
    url.searchParams.set('addRecipeNutrition', 'false')
    url.searchParams.set('apiKey', key)

    try {
      const res = await fetch(url.toString())
      if (!res.ok) continue
      const json = await res.json()
      for (const r of json.results ?? []) {
        if (!seen.has(r.id)) {
          seen.add(r.id)
          results.push(r)
        }
      }
    } catch {
      // network error — skip cuisine
    }
  }

  return results
}
