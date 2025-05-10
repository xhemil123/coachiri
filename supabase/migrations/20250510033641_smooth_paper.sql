/*
  # Update daily_motivation policies

  1. Changes
    - Drop existing policies
    - Recreate policies with service_role checks
    
  2. Security
    - Maintain RLS enabled
    - Update policies to use service_role checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can insert motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can update own motivation posts" ON daily_motivation;
DROP POLICY IF EXISTS "Admins can delete own motivation posts" ON daily_motivation;

-- Recreate policies with service_role checks
CREATE POLICY "Anyone can view motivation posts"
  ON daily_motivation
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert motivation posts"
  ON daily_motivation
  FOR INSERT
  TO authenticated
  WITH CHECK (((SELECT role FROM auth.jwt() WHERE role = 'service_role') IS NOT NULL));

CREATE POLICY "Admins can update own motivation posts"
  ON daily_motivation
  FOR UPDATE
  TO authenticated
  USING (((SELECT role FROM auth.jwt() WHERE role = 'service_role') IS NOT NULL));

CREATE POLICY "Admins can delete own motivation posts"
  ON daily_motivation
  FOR DELETE
  TO authenticated
  USING (((SELECT role FROM auth.jwt() WHERE role = 'service_role') IS NOT NULL));