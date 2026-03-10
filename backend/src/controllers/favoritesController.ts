import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { ApiResponse, Favorite } from '../types';

export async function getFavorites(req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, foods(*)')
    .eq('user_id', req.userId!)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(400).json({ data: null, error: error.message });
    return;
  }

  res.json({ data: data ?? [], error: null } satisfies ApiResponse<Favorite[]>);
}

export async function addFavorite(req: Request, res: Response): Promise<void> {
  const { food_id } = req.body;

  if (!food_id) {
    res.status(400).json({ data: null, error: 'food_id is required.' });
    return;
  }

  const { data, error } = await supabase
    .from('favorites')
    .upsert({ user_id: req.userId!, food_id })
    .select()
    .single();

  if (error) {
    res.status(400).json({ data: null, error: error.message });
    return;
  }

  res.status(201).json({ data, error: null } satisfies ApiResponse<Favorite>);
}

export async function removeFavorite(req: Request, res: Response): Promise<void> {
  const { foodId } = req.params;

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', req.userId!)
    .eq('food_id', foodId);

  if (error) {
    res.status(400).json({ data: null, error: error.message });
    return;
  }

  res.status(204).send();
}
