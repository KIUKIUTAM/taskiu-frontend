import { authApi } from '@/api/Auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useEmailVerify = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const mutationVerify = useMutation({
    mutationFn: async (verifyCode: string) => {
      return await authApi.verifyEmail(verifyCode);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Verify Failed:', error);
      toast.error(t('verifyFailedPleaseTryAgain', { ns: 'error' }));
    },
  });

  return {
    verifyEmail: mutationVerify.mutate,
    isVerifying: mutationVerify.isPending,
    isVerifySuccess: mutationVerify.isSuccess,
    isVerifyError: mutationVerify.isError,
  };
};
