import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const GitHubCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('common');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'GITHUB_LOGIN_SUCCESS', code });
      channel.close();

      setTimeout(() => window.close(), 300);
    }
  }, [searchParams]);

  return (    <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600 font-medium">{t('loginSuccess')}</p>
      </div>);
};
export default GitHubCallbackPage;