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

      // 1. 檢查是否有 response (避免網路斷線等沒有 response 的情況)
      if (error.response) {
        const status = error.response.status;
        const problemDetail = error.response.data; // 這就是後端回傳的 ProblemDetail JSON

        // 2. 判斷 HTTP Status Code
        if (status === 409) {
          // 針對 Email 已存在的特定處理
          // 你可以在 i18n 檔中加一個 'emailAlreadyExists'
          message.error(t('emailAlreadyExists', { ns: 'toast' }));
          return;
        }

        // 也可以直接顯示後端回傳的 detail 訊息 (如果有需要)
        // message.error(problemDetail.detail);
      }

      // 3. 其他錯誤 (500, 400, 網路錯誤等) 的預設處理
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
