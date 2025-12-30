// src/hooks/useGoogleLogin.ts
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import { GOOGLE_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE } from '@/components/auth/googleEnv';
import { authApi } from '@/api/Auth/authApi';
import { useTranslation } from 'react-i18next';

// Singleton Manager
class GoogleLoginManager {
  private static instance: GoogleLoginManager;
  private processingCode: string | null = null;

  private constructor() {}

  public static getInstance(): GoogleLoginManager {
    if (!GoogleLoginManager.instance) {
      GoogleLoginManager.instance = new GoogleLoginManager();
    }
    return GoogleLoginManager.instance;
  }

  public tryLock(code: string): boolean {
    if (this.processingCode === code) return false;
    this.processingCode = code;
    return true;
  }

  public reset() {
    this.processingCode = null;
  }
}

const loginManager = GoogleLoginManager.getInstance();

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const verifier = sessionStorage.getItem('code_verifier');
      if (!verifier) throw new Error('No code verifier found');
      return await authApi.loginWithGoogle(code, verifier);
    },
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      loginManager.reset();
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      alert(t('loginFailedPleaseTryAgain'));
      loginManager.reset();
    },
  });

  const { mutate } = loginMutation;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS' && event.data.code) {
        const incomingCode = event.data.code;

        if (!loginManager.tryLock(incomingCode)) return;

        mutate(incomingCode);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mutate]);

  const startGoogleLogin = useCallback(async () => {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem('code_verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPE,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
    });

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${AUTH_ENDPOINT}?${params.toString()}`,
      'GoogleLogin',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  }, []);

  return {
    login: startGoogleLogin,
    isLoading: loginMutation.isPending,
  };
};
