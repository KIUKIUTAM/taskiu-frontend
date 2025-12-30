import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasSentMessage = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // 1. 如果有錯誤 (例如使用者按了取消)
    if (error) {
      console.error('Google Login Error:', error);
      window.close(); // 直接關閉
      return;
    }

    // 2. 如果有 Code 且是由主視窗開啟的
    if (code && window.opener) {
      if (hasSentMessage.current) return;
      hasSentMessage.current = true;

      // 發送訊息給主視窗
      // targetOrigin 設為 window.location.origin 確保安全性
      window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', code }, window.location.origin);

      // 3. 任務完成，關閉視窗
      // 稍微延遲一點點確保訊息有發出去 (通常不需要，但為了保險)
      setTimeout(() => {
        window.close();
      }, 100);
    } else if (!window.opener) {
      // 如果使用者不是透過 Popup 開啟這個頁面 (例如直接複製網址貼上)
      // 就把他導回首頁
      window.location.replace('/');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600 font-medium">登入成功，正在跳轉...</p>
    </div>
  );
};
