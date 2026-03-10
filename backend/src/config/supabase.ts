import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { Database } from '../types';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

// Service-role client — has full DB access, bypass RLS.
// Only use server-side, NEVER expose to frontend.
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
