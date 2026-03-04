import { authApi } from '@/api/Auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { setAccessToken } from '@/api/api-client';
import message from 'antd/es/message';
import { fetchUserProfile } from './useAuth';

interface LoginCredentials {
  email: string;
  password: string;
  humanVerifyToken: string;
}
interface ProblemDetail {
  title: string;
  detail: string;
  status: number;
  type: string;
}

export const useEmailRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('toast');

  const mutation = useMutation({
    mutationFn: async ({ email, password, humanVerifyToken }: LoginCredentials) => {
      return await authApi.registerWithEmail(email, password, humanVerifyToken);
    },
    onSuccess: async (data: any) => {
      setAccessToken(data.data.accessToken);
      await queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUserProfile,
      });
      navigate('/verify-email');
    },
    onError: (error: AxiosError<ProblemDetail>) => {
      console.error('Register Failed:', error);

      // 1. Check if there is a response (avoid cases like network disconnection)
      if (error.response) {
        const status = error.response.status;
        const problemDetail = error.response.data; // This is the ProblemDetail JSON returned by backend

        // 2. Check HTTP Status Code
        if (status === 409) {
          // Specific handling for Email already exists
          // You can add 'emailAlreadyExists' in i18n file
          message.error(t('emailAlreadyExists', { ns: 'toast' }));
          return;
        }

        // Or directly display the detail message returned by backend (if needed)
        // message.error(problemDetail.detail);
      }

      // 3. Default handling for other errors (500, 400, network errors, etc.)
      message.error(t('registerFailedPleaseTryAgain', { ns: 'toast' }));
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
