import React from 'react';
import { PersonalInfo } from '../../types';
import { Activity, Heart, TrendingUp, Droplet } from 'lucide-react';

interface MetricsCardProps {
  info: PersonalInfo;
}

const BMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi >= 18.5 && bmi < 25) return { label: 'Normal weight', color: 'text-green-500' };
  if (bmi >= 25 && bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obese', color: 'text-red-500' };
};

const MetricsCard: React.FC<MetricsCardProps> = ({ info }) => {
  const bmiInfo = info.bmi ? BMICategory(info.bmi) : { label: 'Not calculated', color: 'text-gray-500' };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary-600 text-white p-4">
        <h3 className="text-lg font-semibold">Your Health Metrics</h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">BMI</p>
              <div className="flex items-center">
                <p className="text-lg font-semibold">{info.bmi}</p>
                <span className={`ml-2 text-sm ${bmiInfo.color}`}>{bmiInfo.label}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-secondary-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Calories</p>
              <p className="text-lg font-semibold">{info.daily_calories} kcal</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-accent-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Activity Level</p>
              <p className="text-lg font-semibold capitalize">
                {info.activity_level.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Weight Goal</p>
              <p className="text-lg font-semibold capitalize">
                {info.weight_goal ? info.weight_goal.replace('_', ' ') : 'Maintenance'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-medium mb-4">Macronutrient Breakdown</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600 mb-2">
                P
              </div>
              <p className="text-sm font-medium">Protein</p>
              <p className="text-lg font-semibold">{info.protein_macro}g</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary-100 text-secondary-600 mb-2">
                C
              </div>
              <p className="text-sm font-medium">Carbs</p>
              <p className="text-lg font-semibold">{info.carbs_macro}g</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent-100 text-accent-600 mb-2">
                F
              </div>
              <p className="text-sm font-medium">Fat</p>
              <p className="text-lg font-semibold">{info.fat_macro}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;