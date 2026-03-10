import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ data: null, error: 'Missing or invalid Authorization header.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Use the anon key to validate the user token (not service role)
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ data: null, error: 'Invalid or expired token.' });
    return;
  }

  req.userId = data.user.id;
  next();
}
