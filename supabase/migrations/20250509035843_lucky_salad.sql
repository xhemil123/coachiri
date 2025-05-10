/*
  # Create personal_info table and enums

  1. New Enums
    - `activity_level`
      - sedentary
      - light
      - moderate
      - active
      - very_active
    - `weight_goal`
      - lose_weight
  
  2. New Tables
    - `personal_info`
      - `info_id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `height` (numeric)
      - `weight` (numeric)
      - `age` (integer)
      - `sex` (text)
      - `activity_level` (activity_level enum)
      - `weight_goal` (weight_goal enum, nullable)
      - `target_weight_loss` (numeric, nullable)
      - `bmi` (numeric, nullable)
      - `daily_calories` (numeric, nullable)
      - `protein_macro` (numeric, nullable)
      - `carbs_macro` (numeric, nullable)
      - `fat_macro` (numeric, nullable)
      
  3. Security
    - Enable RLS on `personal_info` table
    - Add policy for authenticated users to read and update their own data
*/

-- Create enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_level') THEN
    CREATE TYPE activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_goal') THEN
    CREATE TYPE weight_goal AS ENUM ('lose_weight');
  END IF;
END$$;

-- Create personal_info table
CREATE TABLE IF NOT EXISTS personal_info (
  info_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(user_id),
  height numeric NOT NULL,
  weight numeric NOT NULL,
  age integer NOT NULL,
  sex text NOT NULL,
  activity_level activity_level NOT NULL,
  weight_goal weight_goal NULL,
  target_weight_loss numeric NULL,
  bmi numeric NULL,
  daily_calories numeric NULL,
  protein_macro numeric NULL,
  carbs_macro numeric NULL,
  fat_macro numeric NULL
);

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own personal info"
  ON personal_info
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personal info"
  ON personal_info
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal info"
  ON personal_info
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);