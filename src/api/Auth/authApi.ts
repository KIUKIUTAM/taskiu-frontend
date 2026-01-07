import { publicClient, privateClient } from '@/api/api-client';

export const authApi = {
  loginWithGoogle: (code: string, verifier: string) =>
    publicClient.post('/auth/google', {
      code,
      code_verifier: verifier,
    }),
  loginWithGitHub: (code: string, verifier: string) =>
    publicClient.post('/auth/github', {
      code,
      code_verifier: verifier,
    }),
  loginWithEmail: (email: string, password: string) =>
    publicClient.post('/auth/login', {
      email,
      password,
    }),
  logout: () => privateClient.post('/auth/logout'),
};
