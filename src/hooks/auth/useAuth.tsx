// hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/User/userApi';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await userApi.getProfile();
      if (!res) return null;
      return res.data;
    },
    // key setting：
    retry: false, //disable retry on failure
    staleTime: 1000 * 60 * 5, // 5 minutes without revalidation (adjust as needed)
  });
};
