import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/Auth/authApi';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasCalled = useRef(false);

  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const code = searchParams.get('code');
    const verifier = sessionStorage.getItem('code_verifier');

    if (!code || !verifier) {
      setStatus('Error: Missing code or verifier');
      return;
    }

    // 發送 Code + Verifier 給後端
    const exchangeToken = async () => {
      if (hasCalled.current) return; // 鎖住
      hasCalled.current = true;
      try {
        const response = await authApi.loginWithGoogle(code, verifier);
        const data = response.data;
        console.log('Backend Response:', data.accessToken);

        // 清除 verifier
        sessionStorage.removeItem('code_verifier');

        localStorage.setItem('accessToken', data.accessToken);

        setStatus('Login Successful! Redirecting...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      } catch (error) {
        console.error(error);
        setStatus('Login Failed. Check console.');
        setTimeout(() => navigate('/', { replace: true }), 1500);
      }
    };

    exchangeToken();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl font-semibold">{status}</div>
    </div>
  );
};
