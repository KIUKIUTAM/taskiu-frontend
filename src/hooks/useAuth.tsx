// hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/User/userApi';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await userApi.getProfile();
      return res.data;
    },
    // 關鍵設定：
    retry: false, // 失敗(401)不重試，直接噴錯
    staleTime: 1000 * 60 * 5, // 5分鐘內不重新驗證 (看你需求)
  });
};
