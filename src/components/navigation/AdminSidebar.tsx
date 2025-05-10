import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Dumbbell, PenTool, LogOut, Home } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="flex items-center justify-center mb-8 mt-4">
        <Dumbbell className="h-8 w-8 text-primary-400" />
        <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
      </div>
      
      <nav className="space-y-2">
        <Link
          to="/admin"
          className="flex items-center px-4 py-3 text-white bg-gray-700 rounded-md hover:bg-gray-600"
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        
        <Link
          to="/admin/posts"
          className="flex items-center px-4 py-3 text-white hover:bg-gray-700 rounded-md"
        >
          <PenTool className="h-5 w-5 mr-3" />
          Motivation Posts
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-white hover:bg-gray-700 rounded-md mt-8"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;