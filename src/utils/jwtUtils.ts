import { jwtDecode } from 'jwt-decode';

// Define default JWT Payload interface (Modify based on backend structure)
export interface JWTPayload {
  sub: string; // Subject (Usually User ID)
  exp: number; // Expiration time (Unix timestamp in seconds)
  iat?: number; // Issued at
  roles?: string[]; // Example: User roles
  username?: string; // Example: Username
  [key: string]: any; // Allow any other fields
}

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authUtils = {
  /**
   * Get Access Token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set Access Token
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Get Refresh Token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Set Refresh Token
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Clear all Tokens (Used on logout)
   */
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Decode Token
   * @param token Optional, if not provided, defaults to local storage token
   */
  decodeToken: <T = JWTPayload>(token?: string): T | null => {
    const tokenToDecode = token || authUtils.getToken();
    if (!tokenToDecode) return null;

    try {
      return jwtDecode<T>(tokenToDecode);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Check if Token is expired
   * @returns true: Expired or invalid, false: Valid
   */
  isTokenExpired: (token?: string): boolean => {
    const tokenToCheck = token || authUtils.getToken();
    if (!tokenToCheck) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(tokenToCheck);
      const currentTime = Date.now() / 1000;

      // If no exp field, assume not expired (or invalid, depends on logic)
      if (!decoded.exp) return false;

      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  /**
   * Check if user is authenticated (Token exists and not expired)
   */
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    return !!token && !authUtils.isTokenExpired(token);
  },

  /**
   * Get Authorization Header value
   */
  getAuthHeader: (): { Authorization: string } | {} => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
