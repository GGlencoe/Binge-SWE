CREATE TYPE IF NOT EXISTS public.swipe_direction AS ENUM ('like', 'skip', 'super_like');

CREATE TABLE IF NOT EXISTS public.swipes (
  id         UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID            NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_id    UUID            NOT NULL REFERENCES public.foods(id)    ON DELETE CASCADE,
  direction  swipe_direction NOT NULL,
  created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  -- A user can only swipe on a given food once (upsert updates the direction)
  UNIQUE (user_id, food_id)
);

CREATE INDEX IF NOT EXISTS swipes_user_id_idx  ON public.swipes (user_id);
CREATE INDEX IF NOT EXISTS swipes_food_id_idx  ON public.swipes (food_id);
CREATE INDEX IF NOT EXISTS swipes_direction_idx ON public.swipes (user_id, direction);

-- Row Level Security
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own swipes"
  ON public.swipes
  USING (auth.uid() = user_id);
