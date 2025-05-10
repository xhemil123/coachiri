import React from 'react';
import { MealPlan } from '../../types';
import { Utensils, Coffee, Sun, Moon } from 'lucide-react';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  calories: number;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan, calories }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary-600 text-white p-4">
        <h3 className="text-lg font-semibold">Your Personalized Meal Plan</h3>
        <p className="text-sm">Based on your {calories} calorie target</p>
      </div>
      
      <div className="p-5 space-y-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="bg-amber-100 p-3 rounded-full">
              <Coffee className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Breakfast</h4>
            <p className="mt-1 text-gray-700">{mealPlan.breakfast}</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="bg-primary-100 p-3 rounded-full">
              <Sun className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Lunch</h4>
            <p className="mt-1 text-gray-700">{mealPlan.lunch}</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="bg-secondary-100 p-3 rounded-full">
              <Moon className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Dinner</h4>
            <p className="mt-1 text-gray-700">{mealPlan.dinner}</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="bg-accent-100 p-3 rounded-full">
              <Utensils className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Snacks</h4>
            <p className="mt-1 text-gray-700">{mealPlan.snacks}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Daily Calorie Range:</span>
            <span className="text-sm font-semibold">{mealPlan.calorie_range_min} - {mealPlan.calorie_range_max} kcal</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-500">Your Calculated Needs:</span>
            <span className="text-sm font-semibold">{calories} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;