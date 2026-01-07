import React from 'react';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@/assets/svg/GoogleIcon';
import GitHubIcon from '@/assets/svg/GitHubicon';
import { Loader } from 'lucide-react';

interface Props {
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  isGoogleLoading?: boolean;
  isGitHubLoading?: boolean;
}

export const SocialLoginSection: React.FC<Props> = ({
  onGoogleLogin,
  onGitHubLogin,
  isGoogleLoading,
  isGitHubLoading,
}) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isGoogleLoading || isGitHubLoading}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg transition-colors font-medium text-gray-700 ${
            isGoogleLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          {isGoogleLoading ? <Loader className="animate-spin" /> : <GoogleIcon />}
          {isGoogleLoading ? 'Logging in...' : t('continueWithGoogle')}
        </button>
        <button
          type="button"
          onClick={onGitHubLogin}
          disabled={isGitHubLoading || isGoogleLoading}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg transition-colors font-medium text-gray-700 ${
            isGitHubLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          {isGitHubLoading ? <Loader className="animate-spin" /> : <GitHubIcon />}
          {isGitHubLoading ? 'Logging in...' : t('continueWithGitHub')}
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t('orContinueWithEmail')}</span>
        </div>
      </div>
    </>
  );
};
