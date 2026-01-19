import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasSentMessage = useRef(false);
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // 1. handle error case
    if (error) {
      console.error('Google Login Error:', error);
      window.close(); // close the popup
      return;
    }

    // 2. if there is a Code and the page is opened by the main window
    if (code && window.opener) {
      if (hasSentMessage.current) return;
      hasSentMessage.current = true;

      // send message to the main window
      // targetOrigin set to window.location.origin to ensure security
      window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', code }, window.location.origin);

      // 3. Task completed, close the window
      // Slight delay to ensure the message is sent (usually not necessary, but for safety)
      setTimeout(() => {
        window.close();
      }, 100);
    } else if (!window.opener) {
      // If the user did not open this page via a popup (e.g., directly pasted the URL)
      // Redirect them to the homepage
      console.log('no opener');
      navigate('/');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600 font-medium">{t('loginSuccess')}</p>
    </div>
  );
};
