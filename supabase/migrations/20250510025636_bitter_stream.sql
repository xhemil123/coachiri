/*
  # Update weight goal options and meal plan flexibility

  1. Changes
    - Update weight_goal enum to include all options
    - Add target_weight_gain column to personal_info
    - Update meal_plans table constraints
    
  2. Security
    - Maintain existing RLS policies
*/

-- Drop and recreate weight_goal enum with all options
DROP TYPE IF EXISTS weight_goal;
CREATE TYPE weight_goal AS ENUM ('maintain_weight', 'lose_weight', 'gain_weight');

-- Add target_weight_gain column to personal_info
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS target_weight_gain numeric(3,1) CHECK (
  (target_weight_gain >= 0.1 AND target_weight_gain <= 1.2) OR target_weight_gain IS NULL
);

-- Update target_weight_loss constraint
ALTER TABLE personal_info 
DROP CONSTRAINT IF EXISTS personal_info_target_weight_loss_check,
ADD CONSTRAINT personal_info_target_weight_loss_check 
CHECK ((target_weight_loss >= 0.1 AND target_weight_loss <= 1.2) OR target_weight_loss IS NULL);

-- Update meal_plans table to support flexible ranges
ALTER TABLE meal_plans
ADD COLUMN IF NOT EXISTS goal_type weight_goal DEFAULT 'maintain_weight',
ADD COLUMN IF NOT EXISTS flexibility_range integer DEFAULT 100 CHECK (flexibility_range >= 100 AND flexibility_range <= 200);