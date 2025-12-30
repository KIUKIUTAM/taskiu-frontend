// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // 你的 React Query hook
import { Loader2 } from 'lucide-react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useAuth();

  useEffect(() => {
    if (isError) navigate('/', { replace: true });
  }, [isError, navigate]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (isError || !user) return null;

  return <>{children}</>;
};
