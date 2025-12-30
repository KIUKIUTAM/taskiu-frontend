import { privateClient } from '@/api/api-client';

export const userApi = {
  getProfile: () => privateClient.get('/users/me'),
  //updateProfile: (data) => axiosClient.put('/user/profile', data),
};
