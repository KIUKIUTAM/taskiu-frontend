// ==========================================
// Constants
// ==========================================
const BASE_URL = import.meta.env.VITE_BASE_URL;

const GITHUB_CLIENT_ID = 'Ov23li97VAL337gxIATq';
const REDIRECT_URI = `${BASE_URL}/auth/github-callback`;
const AUTH_ENDPOINT = 'https://github.com/login/oauth/authorize';
const SCOPE = 'read:user user:email';

export { GITHUB_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE };
