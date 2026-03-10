import { supabase } from '../config/supabase';
import type { Food } from '../types';

// TODO: replace with the actual API client when the external API is chosen
async function fetchFromExternalApi(params: {
  query?: string;
  dietary?: string[];
}): Promise<Partial<Food>[]> {
  console.log('[RecipeService] fetchFromExternalApi called with', params);
  return [];
}

export async function searchRecipes(params: {
  query?: string;
  dietary?: string[];
}): Promise<Food[]> {
  const { query, dietary } = params;

  let dbQuery = supabase.from('foods').select('*').eq('type', 'recipe').limit(50);

  if (dietary && dietary.length > 0) {
    dbQuery = dbQuery.overlaps('dietary_tags', dietary);
  }

  const { data: cached } = await dbQuery;
  if (cached && cached.length > 0) return cached as Food[];

  const raw = await fetchFromExternalApi({ query, dietary });
  if (raw.length === 0) return [];

  const { data: inserted } = await supabase
    .from('foods')
    .upsert(raw.map((r) => ({ ...r, type: 'recipe' as const })), { onConflict: 'external_id' })
    .select();

  return (inserted ?? []) as Food[];
}
