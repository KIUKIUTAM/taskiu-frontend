// src/hooks/useGitHubLogin.ts
import { useEffect, useCallback, useRef, useState } from 'react'; // 引入 useState
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import {
  GITHUB_CLIENT_ID,
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
} from '@/features/auth/github/githubEnv';
import { authApi } from '@/api/Auth/authApi';
import { useTranslation } from 'react-i18next';

export const useGitHubLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const hasRun = useRef(false);

  // 新增：用來追蹤是否正在進行 OAuth 流程 (包含彈出視窗的時間)
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const verifier = sessionStorage.getItem('code_verifier');
      if (!verifier) throw new Error('No code verifier found');
      return await authApi.loginWithGitHub(code, verifier);
    },
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      hasRun.current = false;
      setIsAuthorizing(false); // 成功後關閉 loading
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      alert(t('loginFailedPleaseTryAgain'));
      hasRun.current = false;
      setIsAuthorizing(false); // 失敗後關閉 loading
    },
  });

  const { mutate } = loginMutation;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GITHUB_LOGIN_SUCCESS' && event.data.code) {
        const incomingCode = event.data.code;

        if (hasRun.current) return;
        hasRun.current = true;

        mutate(incomingCode);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
        // 如果視窗關閉了，且 mutation 還沒開始 (代表沒拿到 code)，則取消 loading
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
