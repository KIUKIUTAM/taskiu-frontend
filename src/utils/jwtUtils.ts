import { jwtDecode } from 'jwt-decode';

// 定义默认的 JWT Payload 接口 (根据你的后端返回结构修改)
export interface JWTPayload {
  sub: string; // Subject (通常是 User ID)
  exp: number; // Expiration time (Unix timestamp in seconds)
  iat?: number; // Issued at
  roles?: string[]; // 示例：用户角色
  username?: string; // 示例：用户名
  [key: string]: any; // 允许其他任意字段
}

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authUtils = {
  /**
   * 获取 Access Token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * 设置 Access Token
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * 获取 Refresh Token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * 设置 Refresh Token
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * 清除所有 Token (登出时使用)
   */
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * 解析 Token
   * @param token 可选，如果不传则默认获取本地存储的 token
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
   * 检查 Token 是否过期
   * @returns true: 已过期或无效, false: 有效
   */
  isTokenExpired: (token?: string): boolean => {
    const tokenToCheck = token || authUtils.getToken();
    if (!tokenToCheck) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(tokenToCheck);
      const currentTime = Date.now() / 1000;

      // 如果没有 exp 字段，假设它不过期 (或者视作无效，取决于你的业务逻辑)
      if (!decoded.exp) return false;

      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  /**
   * 检查用户是否已认证 (Token 存在且未过期)
   */
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    return !!token && !authUtils.isTokenExpired(token);
  },

  /**
   * 获取 Authorization Header 值
   */
  getAuthHeader: (): { Authorization: string } | {} => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
