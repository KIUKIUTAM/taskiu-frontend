import { authApi } from '@/api/Auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setAccessToken } from '@/api/api-client';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useEmailLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('toast');

  const mutation = useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      return await authApi.loginWithEmail(email, password);
    },
    onSuccess: (data: any) => {
      setAccessToken(data.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      toast.error(t('loginFailedPleaseTryAgain'));
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
