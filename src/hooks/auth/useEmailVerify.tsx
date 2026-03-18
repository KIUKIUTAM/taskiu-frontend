import { authApi } from '@/api/Auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '@/api/api-client';
import message from 'antd/es/message';
import { fetchUserProfile } from './useAuth';

export const useEmailVerify = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('toast');

  const mutationVerify = useMutation({
    mutationFn: async (verifyCode: string) => {
      return await authApi.verifyEmail(verifyCode);
    },
    onSuccess: async (data: any) => {
      setAccessToken(data.data.accessToken);
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      await queryClient.fetchQuery({
        queryKey: ['auth-user'],
        queryFn: fetchUserProfile,
      });
    },
    onError: (error) => {
      console.error('Verify Failed:', error);
      message.error(t('verifyFailedPleaseTryAgain'));
    },
  });

  return {
    verifyEmail: mutationVerify.mutate,
    isVerifying: mutationVerify.isPending,
    isVerifySuccess: mutationVerify.isSuccess,
    isVerifyError: mutationVerify.isError,
  };
};
