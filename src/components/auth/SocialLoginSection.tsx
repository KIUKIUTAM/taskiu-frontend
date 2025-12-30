import React from 'react';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@/assets/svg/googleIcon';
import AppleIcon from '@/assets/svg/appleIcon';

interface Props {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  isGoogleLoading?: boolean;
}

export const SocialLoginSection: React.FC<Props> = ({
  onGoogleLogin,
  onAppleLogin,
  isGoogleLoading,
}) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isGoogleLoading}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg transition-colors font-medium text-gray-700 ${
            isGoogleLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          {isGoogleLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
          ) : (
            <GoogleIcon />
          )}
          {isGoogleLoading ? 'Logging in...' : t('continueWithGoogle')}
        </button>

        <button
          type="button"
          onClick={onAppleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:shadow-xl transition-colors font-medium"
        >
          <AppleIcon />
          {t('continueWithApple')}
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
