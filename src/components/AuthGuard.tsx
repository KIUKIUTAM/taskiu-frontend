import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { data: user, isLoading, isError, error } = useAuth();

  console.log('[AuthGuard] ─────────────────────────────');
  console.log('[AuthGuard] pathname   :', location.pathname);
  console.log('[AuthGuard] isLoading  :', isLoading);
  console.log('[AuthGuard] isError    :', isError);
  console.log('[AuthGuard] error      :', error);
  console.log('[AuthGuard] user       :', user);
  console.log('[AuthGuard] verified   :', user?.verified);

  // 1. Handle Loading
  if (isLoading) {
    console.log('[AuthGuard] → LOADING');
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="ml-2">pleace wait...</span>
      </div>
    );
  }

  // 2. Handle errors (including "No access token found")
  if (isError) {
    console.log('[AuthGuard] → ERROR → Navigate to /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If no user data
  if (!user) {
    console.log('[AuthGuard] → NO USER → Navigate to /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 4. Handle email verification
  if (!user.verified && location.pathname !== '/verify-email') {
    console.log('[AuthGuard] → NOT VERIFIED → Navigate to /verify-email');
    return <Navigate to="/verify-email" replace />;
  }

  if (user.verified && location.pathname === '/verify-email') {
    console.log('[AuthGuard] → VERIFIED + on /verify-email → Navigate to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[AuthGuard] → PASS → render children');
  return <>{children}</>;
};
