import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@/assets/svg/googleIcon';
import AppleIcon from '@/assets/svg/appleIcon';
import { googleLogin } from '@/features/auth2/googleHandleLogin';
import { t } from 'i18next';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailLogin?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onEmailLogin,
  onGoogleLogin,
  onAppleLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { t } = useTranslation('common');
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) globalThis.addEventListener('keydown', handleEsc);
    return () => {
      globalThis.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onEmailLogin) onEmailLogin(email, password);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('welcomeBack')}</h2>
          <p className="text-gray-600 mt-1">{t('signInToYourAccount')}</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
          >
            <GoogleIcon />
            {t('continueWithGoogle')}
          </button>
          <button
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

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('emailAddress')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-600">{t('rememberMe')}</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('forgotPassword')}
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('dontHaveAccount')}{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            {t('signUp')}
          </a>
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const LoginModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailLogin = (email: string, password: string) => {
    console.log('Email login:', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    googleLogin();
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 bg-white border-2 text-blue-950 font-bold rounded-lg hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-colors"
      >
        {t('login')}
      </button>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmailLogin={handleEmailLogin}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
      />
    </>
  );
};

export default LoginModalButton;
