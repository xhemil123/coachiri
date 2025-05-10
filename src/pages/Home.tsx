import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Activity, 
  Utensils, 
  Heart, 
  BarChart2, 
  Calendar, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-800 opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" }}
        ></div>
        
        <div className="relative min-h-[80vh] flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Body.</span>
              <span className="block">Transform Your Life.</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-white sm:max-w-3xl">
              Personalized fitness guidance, nutrition plans, and motivation to help you achieve your health and wellness goals.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 py-3 px-8 text-base font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                  <Link
                    to="/register"
                    className="btn bg-white text-primary-600 hover:bg-gray-100 py-3 px-8 text-base font-medium"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-8 text-base font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Features Designed for Your Success
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Everything you need to transform your body and maintain a healthy lifestyle.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Personalized Metrics</h3>
                <p className="mt-2 text-gray-600">
                  Calculate your BMI, daily calories, and macronutrient needs based on your unique profile.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Custom Meal Plans</h3>
                <p className="mt-2 text-gray-600">
                  Get meal plans tailored to your calorie needs and fitness goals.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Daily Motivation</h3>
                <p className="mt-2 text-gray-600">
                  Stay inspired with daily motivational posts and save your favorites.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Progress Tracking</h3>
                <p className="mt-2 text-gray-600">
                  Monitor your progress and see the results of your hard work over time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Customized Routines</h3>
                <p className="mt-2 text-gray-600">
                  Follow fitness routines that match your goals and fitness level.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Expert Support</h3>
                <p className="mt-2 text-gray-600">
                  Get guidance from fitness professionals to maximize your results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your transformation?</span>
            <span className="block text-primary-200">Join CoachIrakli today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="btn bg-white text-primary-600 hover:bg-gray-100 py-3 px-6"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;