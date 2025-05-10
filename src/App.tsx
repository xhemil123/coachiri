import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { initializeMealPlans } from './utils/mealPlans';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealPlan from './pages/MealPlan';
import MotivationFeed from './pages/MotivationFeed';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import PersonalInfoForm from './pages/PersonalInfoForm';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const setupDatabase = async () => {
      await initializeMealPlans(supabase);
    };
    
    setupDatabase();
  }, []);
  
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
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin-login" element={<AdminLogin />} />
        
        <Route path="dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="personal-info" element={
          <PrivateRoute>
            <PersonalInfoForm />
          </PrivateRoute>
        } />
        
        <Route path="meal-plan" element={
          <PrivateRoute>
            <MealPlan />
          </PrivateRoute>
        } />
        
        <Route path="motivation" element={
          <PrivateRoute>
            <MotivationFeed />
          </PrivateRoute>
        } />
      </Route>
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;