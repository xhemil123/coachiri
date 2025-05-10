import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PersonalInfo } from '../types';
import { Edit2, Plus } from 'lucide-react';
import MetricsCard from '../components/dashboard/MetricsCard';
import MacroDonutChart from '../components/dashboard/MacroDonutChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .eq('user_id', user.user_id)
          .single();
        
        if (error) {
          console.error('Error fetching personal info:', error);
          return;
        }
        
        if (data) {
          setPersonalInfo(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersonalInfo();
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
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to CoachIrakli</h1>
          <p className="mt-4 text-xl text-gray-600">
            To get started, we need some information about you to create your personalized fitness plan.
          </p>
          <div className="mt-8">
            <Link
              to="/personal-info"
              className="btn btn-primary inline-flex items-center py-3 px-6 text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              Complete Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your progress and access your personalized fitness plan.
          </p>
        </div>
        <Link
          to="/personal-info"
          className="mt-4 md:mt-0 btn btn-outline inline-flex items-center"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Update Your Info
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MetricsCard info={personalInfo} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Macronutrient Distribution</h3>
          <MacroDonutChart 
            protein={personalInfo.protein_macro || 0} 
            carbs={personalInfo.carbs_macro || 0} 
            fat={personalInfo.fat_macro || 0} 
          />
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-lg font-semibold text-primary-600">{personalInfo.protein_macro}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="text-lg font-semibold text-secondary-600">{personalInfo.carbs_macro}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fat</p>
              <p className="text-lg font-semibold text-accent-600">{personalInfo.fat_macro}g</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-secondary-600 text-white p-4">
            <h3 className="text-lg font-semibold">Your Meal Plan</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Access your personalized meal plan based on your calorie target of {personalInfo.daily_calories} calories.
            </p>
            <Link
              to="/meal-plan"
              className="btn btn-secondary inline-flex items-center"
            >
              View Meal Plan
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-accent-500 text-white p-4">
            <h3 className="text-lg font-semibold">Daily Motivation</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Get inspired with daily motivation posts from Coach Irakli.
            </p>
            <Link
              to="/motivation"
              className="btn bg-accent-500 text-white hover:bg-accent-600 inline-flex items-center"
            >
              View Motivation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;