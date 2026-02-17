    // ==========================================
    // Constants
    // ==========================================
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

    const REDIRECT_URI = `${BASE_URL}/auth/google-callback`;
    const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
    const SCOPE = 'openid email profile';

    export { GOOGLE_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE };
