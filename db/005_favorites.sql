CREATE TABLE IF NOT EXISTS favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_id    UUID NOT NULL REFERENCES foods(id)    ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, food_id)
);

CREATE INDEX favorites_user_idx ON favorites (user_id);
CREATE INDEX favorites_food_idx ON favorites (food_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);
