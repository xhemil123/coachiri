export const mealPlans = [
  // Maintenance Plans
  {
    plan_id: 'c47b4ef6-3567-4495-8d11-261c4a7c5417',
    calorie_range_min: 1200,
    calorie_range_max: 1400,
    breakfast: 'Greek yogurt with berries + 10 almonds',
    lunch: 'Grilled chicken salad with olive oil & vinegar',
    dinner: 'Baked salmon (100g), steamed broccoli, and ½ cup brown rice',
    snacks: '1 boiled egg + ½ apple, Carrot sticks with 1 tbsp hummus',
    portions_multiplier: 1,
    goal_type: 'maintain_weight',
    flexibility_range: 100,
  },
  {
    plan_id: '9f5a9b2c-0123-4456-7890-abcdef123456',
    calorie_range_min: 1500,
    calorie_range_max: 1700,
    breakfast: 'Oatmeal with banana and peanut butter',
    lunch: 'Turkey wrap with veggies + small fruit',
    dinner: 'Stir-fried tofu, vegetables, 1 cup quinoa',
    snacks: 'Low-fat cottage cheese + peach, Protein shake with water',
    portions_multiplier: 1,
    goal_type: 'maintain_weight',
    flexibility_range: 100,
  },
  // Weight Loss Plans
  {
    plan_id: 'e8d7c6b5-a432-1098-7654-321fedcba987',
    calorie_range_min: 1300,
    calorie_range_max: 1500,
    breakfast: '2 egg whites + 1 whole egg, whole grain toast',
    lunch: 'Lean chicken breast, mixed greens salad',
    dinner: 'White fish, roasted vegetables',
    snacks: 'Greek yogurt, apple slices',
    portions_multiplier: 1,
    goal_type: 'lose_weight',
    flexibility_range: 100,
  },
  // Weight Gain Plans
  {
    plan_id: 'b1a2c3d4-e5f6-7890-1234-567890abcdef',
    calorie_range_min: 2500,
    calorie_range_max: 2800,
    breakfast: '3 whole eggs, oatmeal with nuts and banana, whole milk',
    lunch: 'Chicken breast, brown rice, avocado, olive oil',
    dinner: 'Lean beef, sweet potato, mixed vegetables',
    snacks: 'Protein shake with oats and peanut butter, Trail mix',
    portions_multiplier: 1,
    goal_type: 'gain_weight',
    flexibility_range: 100,
  },
];

export const initializeMealPlans = async (supabase: any) => {
  try {
    const { data, error } = await supabase.from('meal_plans').select('*');
    
    if (error) {
      console.error('Error checking for meal plans:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase.from('meal_plans').insert(mealPlans);
      
      if (insertError) {
        console.error('Error inserting meal plans:', insertError);
      }
    }
  } catch (error) {
    console.error('Error initializing meal plans:', error);
  }
};