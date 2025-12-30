import { generateCodeVerifier, generateCodeChallenge } from '@/utils/cryptoLogic';
import { GOOGLE_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE } from '@/features/auth2/googleEnv';

// ==========================================
// 3. Login Component (發起登入)
// ==========================================

const googleLogin = async () => {
  // 1. 生成 Verifier 並存入 Session Storage (因為跳轉後需要用到)
  const verifier = generateCodeVerifier();
  sessionStorage.setItem('code_verifier', verifier);

  // 2. 生成 Challenge
  const challenge = await generateCodeChallenge(verifier);

  // 3. 構建 Google Auth URL
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline', // 如果需要 Refresh Token
  });

  // 4. 跳轉
  globalThis.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
};

export { googleLogin };
