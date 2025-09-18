import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to signin with return url
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is not verified, redirect to verification page
  if (!user.isVerified) {
    return <Navigate to="/verify-email" state={{ 
      email: user.email,
      message: 'Please verify your email to access your profile.'
    }} replace />;
  }

  return children;
};

export default ProtectedRoute;