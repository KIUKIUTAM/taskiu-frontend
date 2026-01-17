import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 基礎設定
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let _accessToken: string | null = localStorage.getItem('accessToken');

// 2. 匯出一個用來設定 Token 的函式
export const setAccessToken = (token: string | null) => {
  _accessToken = token;

  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};
// =================================================================
// 1. Public Client
// =================================================================
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// =================================================================
// 2. Private Client
// =================================================================
export const privateClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// [Request Interceptor]
privateClient.interceptors.request.use(
  (config) => {
    const token = _accessToken;
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// [Response Interceptor]
privateClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) return Promise.reject(error);

    // 處理 401 錯誤
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果正在刷新中，將請求加入佇列等待
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return privateClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 1. 呼叫 Refresh Token API
        const { data } = await publicClient.post('/auth/refresh-token');

        // 2. 儲存新 Token
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        // 3. 處理佇列中的請求 (通知它們刷新成功了，並給予新 Token)
        processQueue(null, newAccessToken);

        // 4. 重試當前這個原本失敗的請求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateClient(originalRequest);
      } catch (refreshError) {
        // 刷新失敗 (Token 過期或無效)
        processQueue(refreshError, null);

        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/'; // 強制登出

        return Promise.reject(refreshError);
      } finally {
        // 無論成功失敗，結束刷新狀態
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
