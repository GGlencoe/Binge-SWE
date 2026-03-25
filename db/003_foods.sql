CREATE TYPE food_type AS ENUM ('restaurant', 'recipe', 'dish');

CREATE TABLE IF NOT EXISTS foods (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id  TEXT UNIQUE,
  type         food_type NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  cuisine_type TEXT[]  NOT NULL DEFAULT '{}',
  dietary_tags TEXT[]  NOT NULL DEFAULT '{}',
  price_range  INT     CHECK (price_range BETWEEN 1 AND 4),
  rating       NUMERIC(3, 2) CHECK (rating BETWEEN 0 AND 5),
  location     JSONB,
  metadata     JSONB   NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX foods_type_idx        ON foods (type);
CREATE INDEX foods_cuisine_gin_idx ON foods USING GIN (cuisine_type);
CREATE INDEX foods_tags_gin_idx    ON foods USING GIN (dietary_tags);
CREATE INDEX foods_rating_idx      ON foods (rating DESC);

CREATE TRIGGER foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read foods"
  ON foods FOR SELECT
  TO authenticated
  USING (true);
