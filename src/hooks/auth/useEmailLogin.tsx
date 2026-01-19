import { authApi } from '@/api/Auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '@/api/api-client';
import message from 'antd/es/message';
import { fetchUserProfile } from './useAuth';

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
    onSuccess: async (data: any) => {
      setAccessToken(data.data.accessToken);
      await queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUserProfile,
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      message.error(t('loginFailedPleaseTryAgain'));
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
