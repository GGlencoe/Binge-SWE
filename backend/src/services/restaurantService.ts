import { supabase } from '../config/supabase';
import type { Food } from '../types';

// TODO: replace with the actual API client when the external API is chosen
async function fetchFromExternalApi(params: {
  lat: number;
  lng: number;
  radius_miles: number;
  cuisine?: string;
}): Promise<Partial<Food>[]> {
  // Placeholder — wire up Yelp / Google Places here
  console.log('[RestaurantService] fetchFromExternalApi called with', params);
  return [];
}

export async function getNearbyRestaurants(params: {
  lat: number;
  lng: number;
  radius_miles?: number;
  cuisine?: string;
}): Promise<Food[]> {
  const { lat, lng, radius_miles = 10, cuisine } = params;

  let query = supabase.from('foods').select('*').eq('type', 'restaurant').limit(50);
  if (cuisine) {
    query = query.overlaps('cuisine_type', [cuisine]);
  }

  const { data: cached } = await query;
  if (cached && cached.length > 0) return cached as Food[];

  const raw = await fetchFromExternalApi({ lat, lng, radius_miles, cuisine });

  if (raw.length === 0) return [];

  const { data: inserted } = await supabase
    .from('foods')
    .upsert(raw.map((r) => ({ ...r, type: 'restaurant' as const })), { onConflict: 'external_id' })
    .select();

  return (inserted ?? []) as Food[];
}
