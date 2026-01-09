import { authApi } from '@/api/Auth/authApi';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const useEmailSend = () => {
  const { t } = useTranslation('error');

  const mutationSend = useMutation({
    mutationFn: async () => {
      return await authApi.sendVerifyEmail();
    },
    onSuccess: (data: any) => {
      toast.success(t('verificationEmailSentPleaseCheckYourInbox'));
    },
    onError: (error) => {
      console.error('Register Failed:', error);
      toast.error(t('registerFailedPleaseTryAgain', { ns: 'error' }));
    },
  });

  return {
    sendVerifyEmail: mutationSend.mutate,
    isSending: mutationSend.isPending,
    isSendSuccess: mutationSend.isSuccess,
    isSendError: mutationSend.isError,
  };
};
