import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PersonalInfo } from '../types';
import { UserCircle, Calendar, Edit2, Weight, Ruler, Activity } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
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
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-600 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="bg-white rounded-full p-3 mb-4 sm:mb-0 sm:mr-6">
              <UserCircle className="h-16 w-16 text-primary-600" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.email}</h2>
              <p className="text-primary-100 flex items-center justify-center sm:justify-start mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Member since {formatDate(new Date().toISOString())}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <Link
              to="/personal-info"
              className="btn btn-outline inline-flex items-center"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </div>
          
          {personalInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Ruler className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Height</p>
                  <p className="text-lg font-semibold">{personalInfo.height} cm</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Weight className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="text-lg font-semibold">{personalInfo.weight} kg</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg font-semibold">{personalInfo.age} years</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <UserCircle className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Sex</p>
                  <p className="text-lg font-semibold capitalize">{personalInfo.sex}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Activity Level</p>
                  <p className="text-lg font-semibold capitalize">{personalInfo.activity_level.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Weight className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight Goal</p>
                  <p className="text-lg font-semibold capitalize">
                    {personalInfo.weight_goal 
                      ? personalInfo.weight_goal.replace('_', ' ') 
                      : 'Maintain current weight'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                You haven't completed your personal information yet.
              </p>
              <Link
                to="/personal-info"
                className="btn btn-primary inline-flex items-center"
              >
                Complete Your Profile
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button className="btn btn-outline w-full justify-start">
              Change Password
            </button>
            <button className="btn btn-outline w-full justify-start">
              Email Preferences
            </button>
            <button className="btn btn-outline w-full justify-start">
              Privacy Settings
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/dashboard" className="btn btn-outline w-full justify-start">
              View Dashboard
            </Link>
            <Link to="/meal-plan" className="btn btn-outline w-full justify-start">
              View Meal Plan
            </Link>
            <Link to="/motivation" className="btn btn-outline w-full justify-start">
              View Motivation Feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;