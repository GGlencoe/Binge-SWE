CREATE TABLE IF NOT EXISTS restaurantswipes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id)     ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id)  ON DELETE CASCADE,
  direction     swipe_direction NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, restaurant_id)
);

CREATE INDEX restaurantswipes_user_idx      ON restaurantswipes (user_id);
CREATE INDEX restaurantswipes_rest_idx      ON restaurantswipes (restaurant_id);
CREATE INDEX restaurantswipes_direction_idx ON restaurantswipes (direction);

ALTER TABLE restaurantswipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own restaurantswipes"
  ON restaurantswipes FOR ALL
  USING (auth.uid() = user_id);
