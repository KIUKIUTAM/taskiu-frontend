// src/hooks/useGitHubLogin.ts
import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import {
  GITHUB_CLIENT_ID,
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
} from '@/components/auth/github/githubEnv';
import { authApi } from '@/api/Auth/authApi';
import { useTranslation } from 'react-i18next';
import { setAccessToken } from '@/api/api-client';
import { message } from 'antd';
import { fetchUserProfile } from '../useAuth';

export const useGitHubLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('toast');
  const hasRun = useRef(false);

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const verifier = sessionStorage.getItem('code_verifier');
      if (!verifier) throw new Error('No code verifier found');
      sessionStorage.removeItem('code_verifier');
      return await authApi.loginWithGitHub(code, verifier);
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
    const channel = new BroadcastChannel('auth_channel');

    channel.onmessage = (event) => {
      if (event.data.type === 'GITHUB_LOGIN_SUCCESS' && event.data.code) {
        if (hasRun.current) return;
        hasRun.current = true;

        mutate(event.data.code);
      }
    };

    return () => channel.close();
  }, [mutate]);
  const startGitHubLogin = useCallback(async () => {
    setIsAuthorizing(true);
    const verifier = generateCodeVerifier();
    sessionStorage.setItem('code_verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
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
      'GitHubLogin',
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
    login: startGitHubLogin,
    isLoading: isAuthorizing || loginMutation.isPending,
  };
};
