CREATE TYPE IF NOT EXISTS public.food_type AS ENUM ('restaurant', 'recipe', 'dish');

CREATE TABLE IF NOT EXISTS public.foods (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id  TEXT        UNIQUE,
  type         food_type   NOT NULL,
  name         TEXT        NOT NULL,
  description  TEXT,
  image_url    TEXT,
  cuisine_type TEXT[]      DEFAULT '{}',
  dietary_tags TEXT[]      DEFAULT '{}',
  price_range  INT         CHECK (price_range BETWEEN 1 AND 4),
  rating       NUMERIC(3,2) CHECK (rating BETWEEN 0 AND 5),
  -- location is only relevant for restaurants
  location     JSONB,
  metadata     JSONB       DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS foods_type_idx        ON public.foods (type);
CREATE INDEX IF NOT EXISTS foods_cuisine_idx     ON public.foods USING GIN (cuisine_type);
CREATE INDEX IF NOT EXISTS foods_dietary_idx     ON public.foods USING GIN (dietary_tags);
CREATE INDEX IF NOT EXISTS foods_rating_idx      ON public.foods (rating DESC);

CREATE OR REPLACE TRIGGER foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Foods are readable by all authenticated users (public catalog)
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read foods"
  ON public.foods FOR SELECT
  TO authenticated
  USING (true);
