import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { 
  calculateAllMetrics, 
  calculateBMI, 
  calculateTDEE,
  adjustCaloriesForGoal,
  calculateMacros
} from '../utils/calculations';
import { ActivityLevel, WeightGoal } from '../types';
import { Save } from 'lucide-react';

type PersonalInfoFormData = {
  height: number;
  weight: number;
  age: number;
  sex: string;
  activity_level: ActivityLevel;
  weight_goal?: WeightGoal;
  target_weight_loss?: number;
  target_weight_gain?: number;
};

const PersonalInfoForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingInfo, setExistingInfo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    watch,
    formState: { errors } 
  } = useForm<PersonalInfoFormData>();
  
  const weightGoal = watch('weight_goal');
  
  useEffect(() => {
    const fetchExistingInfo = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .eq('user_id', user.user_id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching personal info:', error);
          return;
        }
        
        if (data) {
          setExistingInfo(data);
          reset({
            height: data.height,
            weight: data.weight,
            age: data.age,
            sex: data.sex,
            activity_level: data.activity_level,
            weight_goal: data.weight_goal,
            target_weight_loss: data.target_weight_loss,
            target_weight_gain: data.target_weight_gain,
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingInfo();
  }, [user, reset]);
  
  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate health metrics
      const metrics = calculateAllMetrics(data);
      
      const personalInfoData = {
        user_id: user.user_id,
        height: data.height,
        weight: data.weight,
        age: data.age,
        sex: data.sex,
        activity_level: data.activity_level,
        weight_goal: data.weight_goal,
        target_weight_loss: data.target_weight_loss,
        target_weight_gain: data.target_weight_gain,
        ...metrics,
      };
      
      let response;
      
      if (existingInfo) {
        // Update existing record
        response = await supabase
          .from('personal_info')
          .update(personalInfoData)
          .eq('info_id', existingInfo.info_id);
      } else {
        // Insert new record
        response = await supabase
          .from('personal_info')
          .insert(personalInfoData);
      }
      
      if (response.error) {
        setError(response.error.message);
        return;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (isLoading) {
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {existingInfo ? 'Update Your Information' : 'Complete Your Profile'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          We'll use this information to calculate your personalized fitness metrics.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label htmlFor="height" className="label">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                step="0.1"
                className={`input ${errors.height ? 'input-error' : ''}`}
                placeholder="e.g., 175"
                {...register('height', { 
                  required: 'Height is required',
                  min: { value: 100, message: 'Height must be at least 100 cm' },
                  max: { value: 250, message: 'Height must be less than 250 cm' },
                })}
              />
              {errors.height && (
                <p className="mt-1 text-sm text-error-500">{errors.height.message}</p>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="weight" className="label">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                className={`input ${errors.weight ? 'input-error' : ''}`}
                placeholder="e.g., 70"
                {...register('weight', { 
                  required: 'Weight is required',
                  min: { value: 30, message: 'Weight must be at least 30 kg' },
                  max: { value: 300, message: 'Weight must be less than 300 kg' },
                })}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-error-500">{errors.weight.message}</p>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="age" className="label">
                Age
              </label>
              <input
                id="age"
                type="number"
                className={`input ${errors.age ? 'input-error' : ''}`}
                placeholder="e.g., 30"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 18, message: 'You must be at least 18 years old' },
                  max: { value: 100, message: 'Age must be less than 100' },
                })}
              />
              {errors.age && (
                <p className="mt-1 text-sm text-error-500">{errors.age.message}</p>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="sex" className="label">
                Sex
              </label>
              <select
                id="sex"
                className={`input ${errors.sex ? 'input-error' : ''}`}
                {...register('sex', { required: 'Sex is required' })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex && (
                <p className="mt-1 text-sm text-error-500">{errors.sex.message}</p>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="activity_level" className="label">
                Activity Level
              </label>
              <select
                id="activity_level"
                className={`input ${errors.activity_level ? 'input-error' : ''}`}
                {...register('activity_level', { required: 'Activity level is required' })}
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (1-3 days/week)</option>
                <option value="moderate">Moderately active (3-5 days/week)</option>
                <option value="active">Very active (6-7 days/week)</option>
                <option value="very_active">Extra active (very physical job or athlete)</option>
              </select>
              {errors.activity_level && (
                <p className="mt-1 text-sm text-error-500">{errors.activity_level.message}</p>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="weight_goal" className="label">
                Weight Goal
              </label>
              <select
                id="weight_goal"
                className="input"
                {...register('weight_goal')}
              >
                <option value="maintain_weight">Maintain current weight</option>
                <option value="lose_weight">Lose weight</option>
                <option value="gain_weight">Gain weight</option>
              </select>
            </div>
            
            {weightGoal === 'lose_weight' && (
              <div className="form-control">
                <label htmlFor="target_weight_loss" className="label">
                  Target Weekly Weight Loss (kg)
                </label>
                <input
                  id="target_weight_loss"
                  type="number"
                  step="0.1"
                  className={`input ${errors.target_weight_loss ? 'input-error' : ''}`}
                  placeholder="e.g., 0.5"
                  {...register('target_weight_loss', { 
                    required: 'Target weight loss is required',
                    min: { value: 0.1, message: 'Minimum is 0.1 kg per week' },
                    max: { value: 1.2, message: 'Maximum is 1.2 kg per week' },
                  })}
                />
                {errors.target_weight_loss && (
                  <p className="mt-1 text-sm text-error-500">{errors.target_weight_loss.message}</p>
                )}
              </div>
            )}
            
            {weightGoal === 'gain_weight' && (
              <div className="form-control">
                <label htmlFor="target_weight_gain" className="label">
                  Target Weekly Weight Gain (kg)
                </label>
                <input
                  id="target_weight_gain"
                  type="number"
                  step="0.1"
                  className={`input ${errors.target_weight_gain ? 'input-error' : ''}`}
                  placeholder="e.g., 0.5"
                  {...register('target_weight_gain', { 
                    required: 'Target weight gain is required',
                    min: { value: 0.1, message: 'Minimum is 0.1 kg per week' },
                    max: { value: 1.2, message: 'Maximum is 1.2 kg per week' },
                  })}
                />
                {errors.target_weight_gain && (
                  <p className="mt-1 text-sm text-error-500">{errors.target_weight_gain.message}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto flex justify-center py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {existingInfo ? 'Update Information' : 'Save Information'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoForm;