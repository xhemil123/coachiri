/*
  # Create users table

  1. New Tables
    - `users`
      - `user_id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text)
      - `registration_date` (timestamptz)
      - `personal_info_id` (uuid, foreign key, nullable)
      
  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  registration_date timestamptz DEFAULT now(),
  personal_info_id uuid NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);