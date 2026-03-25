CREATE TYPE swipe_direction AS ENUM ('like', 'skip', 'super_like');

CREATE TABLE IF NOT EXISTS swipes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_id    UUID NOT NULL REFERENCES foods(id)    ON DELETE CASCADE,
  direction  swipe_direction NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, food_id)
);

CREATE INDEX swipes_user_idx      ON swipes (user_id);
CREATE INDEX swipes_food_idx      ON swipes (food_id);
CREATE INDEX swipes_direction_idx ON swipes (direction);

ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own swipes"
  ON swipes FOR ALL
  USING (auth.uid() = user_id);
