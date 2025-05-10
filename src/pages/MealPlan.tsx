import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PersonalInfo, MealPlan as MealPlanType } from '../types';
import { getMealPlanForCalories } from '../utils/calculations';
import { PlusCircle } from 'lucide-react';
import MealPlanCard from '../components/meals/MealPlanCard';

const MealPlan: React.FC = () => {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch personal info
        const { data: infoData, error: infoError } = await supabase
          .from('personal_info')
          .select('*')
          .eq('user_id', user.user_id)
          .single();
        
        if (infoError) {
          console.error('Error fetching personal info:', infoError);
          setLoading(false);
          return;
        }
        
        if (infoData) {
          setPersonalInfo(infoData);
          
          // Fetch meal plans
          const { data: mealPlansData, error: mealPlansError } = await supabase
            .from('meal_plans')
            .select('*')
            .order('calorie_range_min', { ascending: true });
          
          if (mealPlansError) {
            console.error('Error fetching meal plans:', mealPlansError);
            setLoading(false);
            return;
          }
          
          // Find the appropriate meal plan based on calorie needs
          if (infoData.daily_calories && mealPlansData.length > 0) {
            const appropriatePlan = getMealPlanForCalories(
              infoData.daily_calories,
              mealPlansData
            );
            
            setMealPlan(appropriatePlan);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-primary-500 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!personalInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Meal Plan</h1>
          <p className="mt-4 text-xl text-gray-600">
            To get your personalized meal plan, we need some information about you first.
          </p>
          <div className="mt-8">
            <Link
              to="/personal-info"
              className="btn btn-primary inline-flex items-center py-3 px-6 text-base"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Complete Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!personalInfo.daily_calories) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Meal Plan</h1>
          <p className="mt-4 text-xl text-gray-600">
            There was an issue calculating your daily calories. Please update your profile information.
          </p>
          <div className="mt-8">
            <Link
              to="/personal-info"
              className="btn btn-primary inline-flex items-center py-3 px-6 text-base"
            >
              Update Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Meal Plan</h1>
        <p className="mt-2 text-lg text-gray-600">
          Personalized nutrition to help you achieve your fitness goals.
        </p>
      </div>
      
      {mealPlan ? (
        <MealPlanCard 
          mealPlan={mealPlan} 
          calories={personalInfo.daily_calories || 0} 
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-700 mb-4">
            We couldn't find a meal plan that matches your calorie needs.
          </p>
          <p className="text-gray-600 mb-6">
            Please check back later or contact support for assistance.
          </p>
        </div>
      )}
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">1</span>
            <span>Drink at least 8 glasses of water daily to stay hydrated.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">2</span>
            <span>Aim to eat every 3-4 hours to maintain steady energy levels.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">3</span>
            <span>Include protein with each meal to support muscle recovery and growth.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">4</span>
            <span>Choose complex carbohydrates over simple sugars for sustained energy.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">5</span>
            <span>Include healthy fats such as avocados, nuts, and olive oil in your diet.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MealPlan;