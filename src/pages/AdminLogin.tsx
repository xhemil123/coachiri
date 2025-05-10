import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Shield, LogIn } from 'lucide-react';

type AdminLoginFormData = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<AdminLoginFormData>();
  
  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await adminLogin(data.email, data.password);
      
      if (error) {
        setError(error);
        return;
      }
      
      navigate('/admin');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Only authorized administrators can access this area
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="form-control mb-4">
              <label htmlFor="email" className="label">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Admin Email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="form-control mb-4">
              <label htmlFor="password" className="label">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Admin Password"
                {...register('password', { 
                  required: 'Password is required'
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Admin Sign in
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary-500">
              Return to User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;