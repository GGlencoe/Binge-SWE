-- Rename swipes -> foodswipes to distinguish food swipes from restaurant swipes

ALTER TABLE swipes RENAME TO foodswipes;

ALTER INDEX swipes_user_idx      RENAME TO foodswipes_user_idx;
ALTER INDEX swipes_food_idx      RENAME TO foodswipes_food_idx;
ALTER INDEX swipes_direction_idx RENAME TO foodswipes_direction_idx;

ALTER POLICY "Users can manage their own swipes" ON foodswipes
  RENAME TO "Users can manage their own foodswipes";
