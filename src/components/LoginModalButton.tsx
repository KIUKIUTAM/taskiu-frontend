import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoginModal from '@/components/auth/LoginModal';

const LoginModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('common');

  const { login: googleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  const handleEmailLogin = (email: string, password: string) => {
    console.log('Email login:', email, password);
  };

  const handleGoogleLogin = () => {
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
        isGoogleLoading={isGoogleLoading}
        onAppleLogin={handleAppleLogin}
      />
    </>
  );
};

export default LoginModalButton;
