/*
  # Create admin_credentials table

  1. New Tables
    - `admin_credentials`
      - `admin_id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text)
      
  2. Security
    - Enable RLS on `admin_credentials` table
    - Add policy for authenticated users to read admin data
*/

CREATE TABLE IF NOT EXISTS admin_credentials (
  admin_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL
);

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read their own data"
  ON admin_credentials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = admin_id);