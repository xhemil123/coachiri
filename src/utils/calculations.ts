import { ActivityLevel, PersonalInfo, WeightGoal } from '../types';

// BMI Calculation
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

// Activity level multipliers
const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// TDEE Calculation (Mifflin-St Jeor Equation)
export const calculateTDEE = (
  weight: number,
  height: number,
  age: number,
  sex: string,
  activityLevel: ActivityLevel
): number => {
  let bmr: number;

  if (sex.toLowerCase() === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * activityMultipliers[activityLevel];
  return Math.round(tdee);
};

// Adjust calories based on goal
export const adjustCaloriesForGoal = (
  tdee: number,
  goal: WeightGoal | undefined,
  targetWeightLoss?: number,
  targetWeightGain?: number
): number => {
  if (!goal || goal === 'maintain_weight') {
    return tdee;
  }

  if (goal === 'lose_weight' && targetWeightLoss) {
    const dailyDeficit = Math.round((targetWeightLoss * 7700) / 7);
    return Math.max(tdee - dailyDeficit, 1200);
  }

  if (goal === 'gain_weight' && targetWeightGain) {
    const dailySurplus = Math.round((targetWeightGain * 7700) / 7);
    return tdee + dailySurplus;
  }

  return tdee;
};

// Calculate macronutrients based on goal
export const calculateMacros = (
  calories: number,
  weight: number,
  goal: WeightGoal = 'maintain_weight'
): { protein: number; fats: number; carbs: number } => {
  let proteinMultiplier: number;
  
  switch (goal) {
    case 'lose_weight':
      proteinMultiplier = 2.0; // Higher protein for muscle preservation
      break;
    case 'gain_weight':
      proteinMultiplier = 1.8; // High protein for muscle gain
      break;
    default:
      proteinMultiplier = 1.6; // Maintenance protein needs
  }

  const proteinInGrams = Math.round(weight * proteinMultiplier);
  const proteinCalories = proteinInGrams * 4;

  const fatPercentage = goal === 'gain_weight' ? 0.3 : 0.25;
  const fatCalories = calories * fatPercentage;
  const fatInGrams = Math.round(fatCalories / 9);

  const carbCalories = calories - proteinCalories - fatCalories;
  const carbsInGrams = Math.round(carbCalories / 4);

  return {
    protein: proteinInGrams,
    fats: fatInGrams,
    carbs: carbsInGrams,
  };
};

// Get the appropriate meal plan based on calorie target and goal
export const getMealPlanForCalories = (
  calories: number,
  mealPlans: any[],
  goal: WeightGoal = 'maintain_weight'
): any => {
  if (!mealPlans || mealPlans.length === 0) return null;
  
  return mealPlans.find(plan => {
    const isInRange = calories >= (plan.calorie_range_min - plan.flexibility_range) &&
                     calories <= (plan.calorie_range_max + plan.flexibility_range);
    return isInRange && plan.goal_type === goal;
  });
};

// Calculate all health metrics at once
export const calculateAllMetrics = (data: Omit<PersonalInfo, 'info_id' | 'user_id'>): Partial<PersonalInfo> => {
  const bmi = calculateBMI(data.weight, data.height);
  const tdee = calculateTDEE(data.weight, data.height, data.age, data.sex, data.activity_level);
  const dailyCalories = adjustCaloriesForGoal(
    tdee, 
    data.weight_goal, 
    data.target_weight_loss,
    data.target_weight_gain
  );
  const macros = calculateMacros(dailyCalories, data.weight, data.weight_goal);

  return {
    bmi,
    daily_calories: dailyCalories,
    protein_macro: macros.protein,
    carbs_macro: macros.carbs,
    fat_macro: macros.fats,
  };
};