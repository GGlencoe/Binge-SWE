import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { ApiResponse, Profile, UserPreferences } from '../types';

export async function getMe(req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.userId!)
    .single();

  if (error) {
    res.status(404).json({ data: null, error: 'Profile not found.' } satisfies ApiResponse<null>);
    return;
  }

  res.json({ data, error: null } satisfies ApiResponse<Profile>);
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const { username, display_name, avatar_url, location } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ username, display_name, avatar_url, location, updated_at: new Date().toISOString() })
    .eq('id', req.userId!)
    .select()
    .single();

  if (error) {
    res.status(400).json({ data: null, error: error.message } satisfies ApiResponse<null>);
    return;
  }

  res.json({ data, error: null } satisfies ApiResponse<Profile>);
}

export async function getPreferences(req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', req.userId!)
    .single();

  if (error) {
    res.status(404).json({ data: null, error: 'Preferences not found.' } satisfies ApiResponse<null>);
    return;
  }

  res.json({ data, error: null } satisfies ApiResponse<UserPreferences>);
}

export async function upsertPreferences(req: Request, res: Response): Promise<void> {
  const { dietary_restrictions, allergies, cuisine_interests, price_range, max_distance_miles } =
    req.body;

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: req.userId!,
      dietary_restrictions,
      allergies,
      cuisine_interests,
      price_range,
      max_distance_miles,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    res.status(400).json({ data: null, error: error.message } satisfies ApiResponse<null>);
    return;
  }

  res.json({ data, error: null } satisfies ApiResponse<UserPreferences>);
}
