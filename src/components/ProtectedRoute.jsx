import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  // Get authentication status from your authentication system
  // This is a placeholder - replace with your actual auth logic
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  if (isAdmin && userRole !== 'admin') {
    // Redirect to unauthorized page if admin access is required but user is not admin
    return <Navigate to="/" />;
  }
  
  // If authenticated and has required permissions, show the protected content
  return children;
};

export default ProtectedRoute;