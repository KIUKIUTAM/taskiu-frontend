import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { SocialLoginSection } from './SocialLoginSection';
import { EmailLoginForm } from './EmailLoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailLogin: ({ email, password }: { email: string; password: string }) => void;
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  isEmailLoading?: boolean;
  isGoogleLoading?: boolean;
  isGitHubLoading?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onEmailLogin,
  onGoogleLogin,
  onGitHubLogin,
  isEmailLoading,
  isGoogleLoading,
  isGitHubLoading,
}) => {
  const { t } = useTranslation('common');

  //headle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('welcomeBack')}</h2>
          <p className="text-gray-600 mt-1">{t('signInToYourAccount')}</p>
        </div>

        {/* 1. Social login section */}
        <SocialLoginSection
          onGoogleLogin={onGoogleLogin}
          onGitHubLogin={onGitHubLogin}
          isGoogleLoading={isGoogleLoading}
          isGitHubLoading={isGitHubLoading}
        />

        {/* 2. Email form section */}
        <EmailLoginForm onEmailLogin={onEmailLogin} isEmailLoading={isEmailLoading} />

        {/* bottom links */}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LoginModal;
