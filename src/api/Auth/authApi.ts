import { publicClient, privateClient } from '@/api/api-client';

export const authApi = {
  loginWithGoogle: (code: string, verifier: string) =>
    publicClient.post('/auth/google', {
      code,
      codeVerifier: verifier,
    }),
  logout: () => privateClient.post('/auth/logout'),
};
