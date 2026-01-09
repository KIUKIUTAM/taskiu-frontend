// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2 } from 'lucide-react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useAuth();

  // Redirect to home page if there is an error (not authenticated)
  useEffect(() => {
    if (isError) navigate('/', { replace: true });
  }, [isError, navigate]);

  // Redirect to email verification page if email is not verified
  console.log('AuthGuard user:', user);
  useEffect(() => {
    if (user && !user.verified) {
      navigate('/verify-email', { replace: true });
    }
  }, [user, navigate]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (isError || !user) return null;

  return <>{children}</>;
};
