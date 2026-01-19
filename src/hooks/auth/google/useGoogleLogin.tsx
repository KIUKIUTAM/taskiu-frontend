// src/hooks/useGoogleLogin.ts
import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import {
  GOOGLE_CLIENT_ID,
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
} from '@/features/auth/google/googleEnv';
import { authApi } from '@/api/Auth/authApi';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { fetchUserProfile } from '../useAuth';

import { setAccessToken } from '@/api/api-client';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('toast');
  const hasRun = useRef(false);

  //for the loading state
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const verifier = sessionStorage.getItem('code_verifier');
      if (!verifier) throw new Error('No code verifier found');
      sessionStorage.removeItem('code_verifier');
      return await authApi.loginWithGoogle(code, verifier);
    },
    onSuccess: async (data: any) => {
      setAccessToken(data.data.accessToken);
      // Invalidate and refetch user data
      await queryClient.ensureQueryData({
        queryKey: ['auth-user'],
        queryFn: fetchUserProfile,
      });
      hasRun.current = false;
      setIsAuthorizing(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

      message.success(t('loginSuccessfulWelcomeBack'));
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      message.error(t('loginFailedPleaseTryAgain'));
      hasRun.current = false;
      setIsAuthorizing(false);
      message.error(t('loginFailedPleaseTryAgain'));
    },
  });

  const { mutate } = loginMutation;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS' && event.data.code) {
        const incomingCode = event.data.code;

        if (hasRun.current) return;
        hasRun.current = true;

        mutate(incomingCode);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mutate]);

  const startGoogleLogin = useCallback(async () => {
    setIsAuthorizing(true);
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

    const popup = window.open(
      `${AUTH_ENDPOINT}?${params.toString()}`,
      'GoogleLogin',
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);

        if (!hasRun.current) {
          setIsAuthorizing(false);
        }
      }
    }, 1000);
  }, []);

  return {
    login: startGoogleLogin,
    isLoading: isAuthorizing || loginMutation.isPending,
  };
};
