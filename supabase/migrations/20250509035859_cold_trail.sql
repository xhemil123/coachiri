/*
  # Create meal_plans table

  1. New Tables
    - `meal_plans`
      - `plan_id` (uuid, primary key)
      - `calorie_range_min` (integer)
      - `calorie_range_max` (integer)
      - `breakfast` (text)
      - `lunch` (text)
      - `dinner` (text)
      - `snacks` (text)
      - `portions_multiplier` (numeric)
      
  2. Security
    - Enable RLS on `meal_plans` table
    - Add policy for authenticated users to read meal plans
*/

CREATE TABLE IF NOT EXISTS meal_plans (
  plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calorie_range_min integer NOT NULL,
  calorie_range_max integer NOT NULL,
  breakfast text NOT NULL,
  lunch text NOT NULL,
  dinner text NOT NULL,
  snacks text NOT NULL,
  portions_multiplier numeric NOT NULL
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (true);