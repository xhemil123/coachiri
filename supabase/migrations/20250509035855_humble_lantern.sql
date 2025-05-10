/*
  # Create user_favorites table

  1. New Tables
    - `user_favorites`
      - `favorite_id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `post_id` (uuid, foreign key)
      - `date_favorited` (timestamptz)
      
  2. Security
    - Enable RLS on `user_favorites` table
    - Add policy for authenticated users to manage their own favorites
*/

CREATE TABLE IF NOT EXISTS user_favorites (
  favorite_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(user_id),
  post_id uuid NOT NULL REFERENCES daily_motivation(post_id),
  date_favorited timestamptz DEFAULT now(),
  CONSTRAINT user_post_unique UNIQUE (user_id, post_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);