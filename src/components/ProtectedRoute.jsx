import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      
      if (!authStatus) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      
      // If this is an admin route, check if user has admin role
      if (isAdmin) {
        const user = getCurrentUser();
        const hasAdminRole = user.role === 'admin' || user.role === 'super-admin';
        setAuthorized(hasAdminRole);
      } else {
        setAuthorized(true);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [isAdmin]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!authorized) {
    // Redirect to login with the return URL
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;