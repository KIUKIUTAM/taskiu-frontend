// src/hooks/useGoogleLogin.ts
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import { GOOGLE_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE } from '@/components/auth/googleEnv';
import { authApi } from '@/api/Auth/authApi';

// ------------------------------------------------------------------
// 🔥 1. Singleton Manager (單例管理器)
// 將狀態管理的邏輯封裝在這裡，而不是裸露的變數。
// 這確保了整個應用程式中，只有這一個管理器在控制登入狀態。
// ------------------------------------------------------------------
class GoogleLoginManager {
  private static instance: GoogleLoginManager;
  private processingCode: string | null = null;
  private isLoginWindowOpen: boolean = false;

  private constructor() {}

  public static getInstance(): GoogleLoginManager {
    if (!GoogleLoginManager.instance) {
      GoogleLoginManager.instance = new GoogleLoginManager();
    }
    return GoogleLoginManager.instance;
  }

  // 檢查並鎖定：如果這個 code 已經處理過，回傳 false；否則鎖定並回傳 true
  public tryLock(code: string): boolean {
    if (this.processingCode === code) {
      console.warn(`[GoogleAuth] 攔截重複請求 (Code: ${code.substring(0, 5)}...)`);
      return false; // 鎖定失敗，已經處理過
    }
    this.processingCode = code;
    return true; // 鎖定成功
  }

  // 重置狀態 (例如登入失敗後允許重試)
  public reset() {
    this.processingCode = null;
    this.isLoginWindowOpen = false;
  }
}

// 取得唯一的管理器實例
const loginManager = GoogleLoginManager.getInstance();

// ------------------------------------------------------------------
// Hook 本體
// ------------------------------------------------------------------
export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const verifier = sessionStorage.getItem('code_verifier');
      if (!verifier) throw new Error('No code verifier found');
      return await authApi.loginWithGoogle(code, verifier);
    },
    onSuccess: (data: any) => {
      console.log('[GoogleAuth] Login Success');
      localStorage.setItem('accessToken', data.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });

      // 登入成功後，重置管理器狀態，以防未來需要再次登入
      loginManager.reset();

      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('[GoogleAuth] Login Failed:', error);
      alert('登入失敗，請重試');

      // 🔥 關鍵：失敗時要解鎖，讓使用者可以再試一次
      loginManager.reset();
    },
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 安全性檢查：來源必須是我們自己的網站
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS' && event.data.code) {
        const incomingCode = event.data.code;

        // 🔥 2. 使用 Manager 進行檢查
        // 這裡變得非常乾淨，邏輯都被封裝在 tryLock 裡面了
        if (!loginManager.tryLock(incomingCode)) {
          return; // 被擋下來了
        }

        console.log('[GoogleAuth] 收到新 Code，開始處理:', incomingCode);
        loginMutation.mutate(incomingCode);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loginMutation]);

  const startGoogleLogin = useCallback(async () => {
    // 產生 PKCE 驗證碼
    const verifier = generateCodeVerifier();
    sessionStorage.setItem('code_verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    // 建議：加上 'state' 參數可以防止 CSRF 攻擊 (進階資安)
    // const state = generateRandomString();
    // sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPE,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      // state: state, // 建議未來加上
    });

    const googleAuthUrl = `${AUTH_ENDPOINT}?${params.toString()}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      googleAuthUrl,
      'GoogleLogin',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  }, []);

  return {
    login: startGoogleLogin,
    isLoading: loginMutation.isPending,
  };
};
