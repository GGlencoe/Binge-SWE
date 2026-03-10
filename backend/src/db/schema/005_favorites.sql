-- Populated automatically on like/super_like swipes (see swipeController).
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_id    UUID        NOT NULL REFERENCES public.foods(id)    ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, food_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites (user_id);

-- Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
  ON public.favorites
  USING (auth.uid() = user_id);
