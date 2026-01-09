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
  registerWithEmail: (email: string, password: string, turnstileToken: string) =>
    publicClient.post('/auth/register', {
      email,
      password,
      turnstile_token: turnstileToken,
    }),
  //send verify email api
  sendVerifyEmail: () => privateClient.post('/email/send-verify-email'),
  verifyEmail: (verifyCode: string) =>
    privateClient.post('/email/verify-email', {
      verify_code: verifyCode,
    }),
  getAuthUser: () => privateClient.get('/auth/user'),
  logout: () => privateClient.post('/auth/logout'),
};
