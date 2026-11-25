import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { RouteLoadingFallback } from '@/src/components/ui/RouteLoadingFallback';

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return <RouteLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sk-portal/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
