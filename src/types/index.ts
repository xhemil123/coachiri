export type User = {
  user_id: string;
  email: string;
};

export type PersonalInfo = {
  info_id: string;
  user_id: string;
  height: number;
  weight: number;
  age: number;
  sex: string;
  activity_level: ActivityLevel;
  weight_goal?: WeightGoal;
  target_weight_loss?: number;
  target_weight_gain?: number;
  bmi?: number;
  daily_calories?: number;
  protein_macro?: number;
  carbs_macro?: number;
  fat_macro?: number;
};

export type MotivationPost = {
  post_id: string;
  admin_id: string;
  content: string;
  post_date: string;
  image_url?: string;
};

export type UserFavorite = {
  favorite_id: string;
  user_id: string;
  post_id: string;
  date_favorited: string;
};

export type MealPlan = {
  plan_id: string;
  calorie_range_min: number;
  calorie_range_max: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  portions_multiplier: number;
  goal_type: WeightGoal;
  flexibility_range: number;
};

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type WeightGoal = 'maintain_weight' | 'lose_weight' | 'gain_weight';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  adminLogin: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};