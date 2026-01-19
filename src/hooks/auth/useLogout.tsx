// hooks/useLogout.ts
import { setAccessToken } from '@/api/api-client';
import { authApi } from '@/api/Auth/authApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: ['auth-user'] });
      navigate('/', { replace: true });
      await authApi.logout();
    },
    onSuccess: () => {
      message.success('Logout successful');
    },
  });
};
