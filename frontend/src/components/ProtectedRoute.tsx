import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if role not allowed
    if (user.role === 'ROLE_PATIENT') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'ROLE_DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};
