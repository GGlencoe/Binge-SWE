CREATE TABLE IF NOT EXISTS restaurants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id  TEXT UNIQUE,
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

CREATE INDEX restaurants_cuisine_gin_idx ON restaurants USING GIN (cuisine_type);
CREATE INDEX restaurants_tags_gin_idx    ON restaurants USING GIN (dietary_tags);
CREATE INDEX restaurants_rating_idx      ON restaurants (rating DESC);

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read restaurants"
  ON restaurants FOR SELECT
  TO authenticated
  USING (true);
