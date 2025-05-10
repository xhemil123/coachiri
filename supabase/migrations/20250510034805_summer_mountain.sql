/*
  # Fix daily_motivation table and policies

  1. Changes
    - Ensure table exists with correct structure
    - Update policies with correct JWT checks
    
  2. Security
    - Maintain RLS enabled
    - Fix policy checks for service role
*/

-- Recreate table if needed
CREATE TABLE IF NOT EXISTS daily_motivation (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_credentials(admin_id),
  content text NOT NULL,
  post_date date DEFAULT CURRENT_DATE,
  image_url text NULL
);

-- Enable RLS
ALTER TABLE daily_motivation ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can insert motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can update own motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can delete own motivation posts" ON daily_motivation;

-- Create new policies
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