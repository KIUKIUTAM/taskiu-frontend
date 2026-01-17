import { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2 } from 'lucide-react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isLoading, isError } = useAuth();

  // 1. 處理 Loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user.verified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  if (user.verified && location.pathname === '/verify-email') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
