import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { ApiResponse, Food } from '../types';

// TODO: replace with a collaborative filtering or ML-based approach
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  const limit = parseInt(req.query.limit as string) || 10;

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('dietary_restrictions, cuisine_interests, price_range, max_distance_miles')
    .eq('user_id', req.userId!)
    .single();

  const { data: swipedRows } = await supabase
    .from('swipes')
    .select('food_id')
    .eq('user_id', req.userId!);

  const swipedIds = swipedRows?.map((r) => r.food_id) ?? [];

  let query = supabase.from('foods').select('*').limit(limit);

  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`);
  }

  if (prefs?.cuisine_interests && prefs.cuisine_interests.length > 0) {
    query = query.overlaps('cuisine_type', prefs.cuisine_interests);
  }

  if (prefs?.price_range) {
    query = query.lte('price_range', prefs.price_range);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    res.status(400).json({ data: null, error: error.message });
    return;
  }

  res.json({ data: data ?? [], error: null } satisfies ApiResponse<Food[]>);
}
