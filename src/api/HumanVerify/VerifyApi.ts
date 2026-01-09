import { publicClient, privateClient } from '@/api/api-client';

export const VerifyApi = {
  humanVerify: (token: string) =>
    publicClient.post('/turnstile/verify', {
      token,
    }),
};
