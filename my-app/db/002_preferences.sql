CREATE TABLE IF NOT EXISTS user_preferences (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_restrictions TEXT[]  NOT NULL DEFAULT '{}',
  allergies            TEXT[]  NOT NULL DEFAULT '{}',
  cuisine_interests    TEXT[]  NOT NULL DEFAULT '{}',
  price_range          INT     CHECK (price_range BETWEEN 1 AND 4),
  max_distance_miles   NUMERIC(6, 2) DEFAULT 10,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
