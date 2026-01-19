import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2 } from 'lucide-react';
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { data: user, isLoading, isError, error } = useAuth();

  // 1. 處理 Loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
        <span className="ml-2">載入用戶資料中...</span>
      </div>
    );
  }

  // 2. 處理錯誤（包括 "No access token found"）
  if (isError) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. 如果沒有用戶數據
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 4. 處理 email 驗證
  if (!user.verified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  if (user.verified && location.pathname === '/verify-email') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
