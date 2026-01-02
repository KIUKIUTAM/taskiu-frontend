// hooks/useLogout.ts
import { authApi } from '@/api/Auth/authApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      queryClient.removeQueries({ queryKey: ['auth-user'] });
      navigate('/', { replace: true });
    },
  });
};
