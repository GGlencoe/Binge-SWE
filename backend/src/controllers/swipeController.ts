import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { ApiResponse, PaginatedResponse, Swipe } from '../types';

export async function recordSwipe(req: Request, res: Response): Promise<void> {
  const { food_id, direction } = req.body;

  if (!food_id || !direction) {
    res.status(400).json({ data: null, error: 'food_id and direction are required.' });
    return;
  }

  const validDirections = ['like', 'skip', 'super_like'];
  if (!validDirections.includes(direction)) {
    res.status(400).json({ data: null, error: `direction must be one of: ${validDirections.join(', ')}` });
    return;
  }

  // Upsert so re-swiping on the same food updates rather than errors
  const { data, error } = await supabase
    .from('swipes')
    .upsert({ user_id: req.userId!, food_id, direction })
    .select()
    .single();

  if (error) {
    res.status(400).json({ data: null, error: error.message } satisfies ApiResponse<null>);
    return;
  }

  if (direction === 'like' || direction === 'super_like') {
    await supabase
      .from('favorites')
      .upsert({ user_id: req.userId!, food_id })
      .throwOnError();
  }

  res.status(201).json({ data, error: null } satisfies ApiResponse<Swipe>);
}

export async function getSwipeHistory(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const from = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('swipes')
    .select('*, foods(*)', { count: 'exact' })
    .eq('user_id', req.userId!)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) {
    res.status(400).json({ data: null, error: error.message });
    return;
  }

  res.json({
    data: data ?? [],
    error: null,
    count: count ?? 0,
    page,
    limit,
  } satisfies PaginatedResponse<Swipe>);
}
