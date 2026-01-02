import { privateClient } from '@/api/api-client';

export const userApi = {
  getProfile: () => {
    if (!localStorage.getItem('accessToken')) {
      return null;
    }
    return privateClient.get('/users/me');
  },
  //updateProfile: (data) => privateClient.put('/user/profile', data),
};
