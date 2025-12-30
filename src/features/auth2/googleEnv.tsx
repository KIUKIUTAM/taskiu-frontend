// ==========================================
// Constants
// ==========================================
const BASE_URL = import.meta.env.VITE_BASE_URL;

const GOOGLE_CLIENT_ID = '442998333725-olh3o7q8244lkkrjuej1n2eol0pt6psm.apps.googleusercontent.com';
const REDIRECT_URI = `${BASE_URL}/callback`;
const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const SCOPE = 'openid email profile';

export { GOOGLE_CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPE };
