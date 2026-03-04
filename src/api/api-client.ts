import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Basic settings
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let _accessToken: string | null = localStorage.getItem('accessToken');

export const getAccessToken = () => _accessToken;

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
    console.log('=== AXIOS INTERCEPTOR ERROR ===');
    console.log('Error status:', error.response?.status);
    console.log('Error config:', error.config);
    console.log('Current URL:', window.location.href);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) return Promise.reject(error);

    // Handle 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 Error detected, starting refresh process...');

      // If refreshing, add request to queue
      if (isRefreshing) {
        console.log('Already refreshing, adding to queue...');
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
        console.log('Attempting to refresh token...');
        // 1. Call Refresh Token API
        const { data } = await publicClient.post('/auth/refresh-token');

        // 2. Save new Token
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);
        console.log('Token refreshed successfully');

        // 3. Process requests in queue
        processQueue(null, newAccessToken);

        // 4. Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateClient(originalRequest);
      } catch (refreshError) {
        console.log('=== REFRESH TOKEN FAILED - REDIRECTING TO HOME ===');
        console.log('Refresh error:', refreshError);

        // Refresh failed (Token expired or invalid)
        processQueue(refreshError, null);

        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('accessToken');

        // Redirect here!
        window.location.href = '/';

        return Promise.reject(refreshError);
      } finally {
        // End refreshing state regardless of success or failure
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
