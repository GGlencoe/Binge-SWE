CREATE TABLE IF NOT EXISTS public.user_preferences (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dietary_restrictions TEXT[]        DEFAULT '{}',
  allergies            TEXT[]        DEFAULT '{}',
  cuisine_interests    TEXT[]        DEFAULT '{}',
  price_range          INT           CHECK (price_range BETWEEN 1 AND 4),
  max_distance_miles   NUMERIC(6,2)  DEFAULT 10,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE OR REPLACE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON public.user_preferences
  USING (auth.uid() = user_id);
