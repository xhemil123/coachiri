/*
  # Create daily_motivation table

  1. New Tables
    - `daily_motivation`
      - `post_id` (uuid, primary key)
      - `admin_id` (uuid, foreign key)
      - `content` (text)
      - `post_date` (timestamptz)
      - `image_url` (text, nullable)
      
  2. Security
    - Enable RLS on `daily_motivation` table
    - Add policy for authenticated users to read posts
    - Add policy for admins to insert, update, and delete posts
*/

CREATE TABLE IF NOT EXISTS daily_motivation (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_credentials(admin_id),
  content text NOT NULL,
  post_date timestamptz DEFAULT now(),
  image_url text NULL
);

ALTER TABLE daily_motivation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view motivation posts"
  ON daily_motivation
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert motivation posts"
  ON daily_motivation
  FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can update own motivation posts"
  ON daily_motivation
  FOR UPDATE
  TO authenticated
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can delete own motivation posts"
  ON daily_motivation
  FOR DELETE
  TO authenticated
  USING (admin_id = auth.uid());