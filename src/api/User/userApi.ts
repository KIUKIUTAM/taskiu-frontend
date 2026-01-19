import { getAccessToken, privateClient } from '@/api/api-client';
export const userApi = {
  getProfile: async () => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await privateClient.get('/users/me');
    return response;
  },
};
