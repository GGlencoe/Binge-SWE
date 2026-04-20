-- Rename favorites -> saved and add type support for food vs restaurant

CREATE TYPE saved_type AS ENUM ('food', 'restaurant');

ALTER TABLE favorites RENAME TO saved;

-- Existing rows are food saves; add type column with default, then drop default
ALTER TABLE saved ADD COLUMN type saved_type NOT NULL DEFAULT 'food';
ALTER TABLE saved ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;

-- food_id may now be NULL for restaurant saves
ALTER TABLE saved ALTER COLUMN food_id DROP NOT NULL;

ALTER TABLE saved ALTER COLUMN type DROP DEFAULT;

ALTER TABLE saved ADD CONSTRAINT saved_type_check CHECK (
  (type = 'food'       AND food_id IS NOT NULL       AND restaurant_id IS NULL) OR
  (type = 'restaurant' AND restaurant_id IS NOT NULL  AND food_id IS NULL)
);

CREATE UNIQUE INDEX saved_user_restaurant_idx
  ON saved (user_id, restaurant_id)
  WHERE restaurant_id IS NOT NULL;

CREATE INDEX saved_restaurant_idx ON saved (restaurant_id);

ALTER INDEX favorites_user_idx RENAME TO saved_user_idx;
ALTER INDEX favorites_food_idx RENAME TO saved_food_idx;

ALTER POLICY "Users can manage their own favorites" ON saved
  RENAME TO "Users can manage their own saved";
