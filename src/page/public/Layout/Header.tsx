import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ant Design Imports
import { Button, ConfigProvider, theme } from 'antd';
import MenuOutlined from '@ant-design/icons/MenuOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'

// Hooks & Components
import LoginModal from '@/components/auth/LoginModal';
import LanguageChangeButton from '@/components/languageChangeButton';
import { useGoogleLogin } from '@/hooks/auth/google/useGoogleLogin';
import { useGitHubLogin } from '@/hooks/auth/github/useGitHubLogin';
import { useEmailLogin } from '@/hooks/auth/useEmailLogin';
import { getAccessToken } from '@/api/api-client';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t: tCommon } = useTranslation('common');
  const { t: tPage } = useTranslation('page.public.layoutHeader');
  const navigate = useNavigate();

  // Get Antd token (if needed to use JS variables to control color)
  const { token } = theme.useToken();

  const accessToken = getAccessToken();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: tPage('nav.home'), href: '' },
    { label: tPage('nav.services'), href: 'services' },
    { label: tPage('nav.about'), href: 'about' },
    { label: tPage('nav.contact'), href: 'contact' },
  ];

  const { login: googleLogin, isLoading: isGoogleLoading } = useGoogleLogin();
  const { login: gitHubLogin, isLoading: isGitHubLoading } = useGitHubLogin();
  const { login: emailLogin, isLoading: isEmailLoading } = useEmailLogin();

  const handleGoogleLogin = useCallback(() => {
    googleLogin();
  }, [googleLogin]);

  const handleGitHubLogin = useCallback(() => {
    gitHubLogin();
  }, [gitHubLogin]);

  const handleEmailLogin = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      emailLogin({ email, password });
    },
    [emailLogin],
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#172554',
          borderRadius: 6,
        },
        components: {
          Button: {
            controlHeight: 40,
          },
        },
      }}
    >
      <>
        <header
          className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/98 shadow-xl backdrop-blur-md'
              : 'bg-white/95 shadow-md backdrop-blur-sm'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo Section */}
              <div className="flex items-center cursor-pointer group">
                <div className="flex items-center gap-2">
                  <span
                    className="text-2xl md:text-3xl font-bold text-blue-950 filter drop-shadow-lg"
                    onClick={() => navigate('')}
                  >
                    TasKiu
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 ml-16">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="relative px-4 py-2 text-gray-700 font-medium text-sm xl:text-base hover:text-blue-950 transition-colors duration-300 group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 group-hover:w-full transition-all duration-100"></span>
                  </button>
                ))}
              </nav>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {accessToken ? (
                  <Button type="default" className="!font-bold px-6" onClick={() => navigate('/dashboard')}>
                    {tPage('startUsing')}
                  </Button>
                ) : (

                  <Button
                    type="default"
                    onClick={() => setIsModalOpen(true)}
                    className="!font-bold px-6"
                  >
                    {tCommon('signIn')}
                  </Button>
                )}
                <div className="ml-2">
                  <LanguageChangeButton />
                </div>
              </div>

              {/* Mobile Menu Button - Use Antd Button Icon */}
              <div className="flex lg:hidden items-center gap-2">
                <LanguageChangeButton />
                <Button
                  type="text"
                  icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  size="large"
                  className="flex items-center justify-center"
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Keep original dropdown logic, but use Antd internally */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
              isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  type="text"
                  block
                  className="text-left justify-start h-12 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-950"
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
                {accessToken ? (
                  <Button type="default" className="!font-bold px-6" block size="large" onClick={() => navigate('/dashboard')}>
                    {tPage('startUsing')}
                  </Button>
                ) : (
                  <Button
                    type="default"
                    block
                    size="large"
                    className="!font-bold px-6"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {tCommon('signIn')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEmailLogin={handleEmailLogin}
          isEmailLoading={isEmailLoading}
          onGoogleLogin={handleGoogleLogin}
          isGoogleLoading={isGoogleLoading}
          onGitHubLogin={handleGitHubLogin}
          isGitHubLoading={isGitHubLoading}
        />
      </>
    </ConfigProvider>
  );
};

export default Header;
