import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { LoadingState } from '@/src/components/ui/LoadingState';
import type { UserRole } from '@/src/types/database';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
  fallbackPath?: string;
}

/**
 * WasteX AI - Real Supabase Role-Based Protected Route
 * Enforces role isolation (generator routes for generators, buyer routes for buyers, admin for admin).
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
  fallbackPath,
}) => {
  const { profile, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
        <LoadingState message="Verifying facility node credentials & role permissions..." />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins can access all portals; otherwise user must match allowed roles
  const hasAccess = profile.role === 'admin' || allowedRoles.includes(profile.role);

  if (!hasAccess) {
    // Route to user's designated home portal
    const designatedHome =
      profile.role === 'buyer' ? '/buyer' : profile.role === 'admin' ? '/admin' : '/app';

    return <Navigate to={fallbackPath || designatedHome} replace />;
  }

  return <>{children}</>;
};
