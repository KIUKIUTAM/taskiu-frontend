import { publicClient, privateClient } from '@/api/api-client';

export const VerifyApi = {
  humanVerify: (token: string) =>
    privateClient.post('/turnstile/verify', {
      token,
    }),
};
