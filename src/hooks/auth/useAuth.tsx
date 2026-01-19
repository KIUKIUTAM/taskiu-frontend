// hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/User/userApi';

export const fetchUserProfile = async () => {
  const res = await userApi.getProfile();
  return res?.data || null;
};
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: fetchUserProfile,
    // key setting：
    retry: false, //disable retry on failure
    staleTime: 1000 * 60 * 5, // 5 minutes without revalidation (adjust as needed)
  });
};
