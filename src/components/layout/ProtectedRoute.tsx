import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { LoadingState } from '@/src/components/ui/LoadingState';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallbackPath?: string;
}

/**
 * WasteX AI - Real Supabase Protected Route
 * Protects routes requiring an authenticated Supabase session.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <LoadingState message="Validating enterprise session credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
