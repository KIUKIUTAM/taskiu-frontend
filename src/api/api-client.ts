import axios from 'axios';

// 基礎設定
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =================================================================
// 1. Public Client (for public: login, register, refresh token itself)
// =================================================================
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// =================================================================
// 2. Private Client (for private: all requests that need Access Token)
// =================================================================
export const privateClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // If your Refresh Token is stored in an HttpOnly Cookie, this line is very important
});

// [Request Interceptor]: Automatically add Access Token to Header
privateClient.interceptors.request.use(
  (config) => {
    // Get Token from LocalStorage or Store
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// [Response Interceptor]: Handle Token Expiration (401)
privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If you encounter a 401 error and this request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to avoid infinite loop

      try {
        // 1. Call Refresh Token API (usually using publicClient or directly axios)
        // If your refresh token is stored in a cookie, the backend will read it automatically
        const { data } = await publicClient.post('/auth/refresh-token');

        // 2. Get the new Access Token and save it
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 3. Update the original request's Header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. Retry the original failed request
        return privateClient(originalRequest);
      } catch (refreshError) {
        // Refresh also failed (meaning Refresh Token is expired or invalid)
        console.error('Refresh token failed', refreshError);

        // Clear data and force logout
        localStorage.removeItem('accessToken');
        //window.location.href = '/';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
