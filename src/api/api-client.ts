import axios from 'axios';

// 基礎設定
const BASE_URL = '/api'; // 配合你的 Vite Proxy

// =================================================================
// 1. Public Client (公開用：登入、註冊、刷新 Token 本身)
// =================================================================
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// =================================================================
// 2. Private Client (私有用：需要 Access Token 的所有請求)
// =================================================================
export const privateClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 如果你的 Refresh Token 存是 HttpOnly Cookie，這行很重要
});

// [Request Interceptor]：自動把 Access Token 塞進 Header
privateClient.interceptors.request.use(
  (config) => {
    // 從 LocalStorage 或 Store 取出 Token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// [Response Interceptor]：處理 Token 過期 (401)
privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果遇到 401 錯誤，且這個請求還沒重試過
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 標記為已重試，避免無窮迴圈

      try {
        // 1. 呼叫 Refresh Token API (這通常是用 publicClient 或直接 axios)
        // 假設你的 refresh token 存在 cookie 裡，後端會自己讀
        const { data } = await publicClient.post('/auth/refresh-token');

        // 2. 拿到新的 Access Token，存起來
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 3. 更新原本請求的 Header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. 重送原本失敗的請求
        return privateClient(originalRequest);
      } catch (refreshError) {
        // Refresh 也失敗了 (代表 Refresh Token 也過期或無效)
        console.error('Refresh token failed', refreshError);

        // 清除資料並強制登出
        localStorage.removeItem('accessToken');
        //window.location.href = '/';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
