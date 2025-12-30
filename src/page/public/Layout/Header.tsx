// Header.tsx
import React, { useState, useEffect } from 'react';
import LoginButton from '@/components/LoginModalButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageChangeButton from '@/components/languageChangeButton';
import { Button } from '@/components/ui/Button';

const Header: React.FC = () => {
  type Locale = 'en' | 'tw';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken') as string | null;

  // Handle scroll to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(globalThis.scrollY > 20);
    };

    globalThis.addEventListener('scroll', handleScroll);
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { label: t('home'), href: '' },
    { label: t('services'), href: 'services' },
    { label: t('aboutUs'), href: 'about' },
    { label: t('contact'), href: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
              <span className="text-2xl md:text-3xl font-bold text-blue-950 filter drop-shadow-lg">
                TasKiu
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-16">
            {navItems.map((item, index) => (
              <button
                key={index}
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
              // if logged in (user exists)
              <Button onClick={() => navigate('/dashboard')}>{t('startUsing')}</Button>
            ) : (
              // if not logged in
              <LoginButton />
            )}
            <LanguageChangeButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-stretch">
            <LanguageChangeButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div
                className={`w-6 flex flex-col justify-between ${isMobileMenuOpen ? 'h-2.5' : 'h-4'}`}
              >
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Action Buttons */}
          <div className="pt-4 space-y-3 justify-center flex">
            {accessToken ? (
              // if logged in (user exists)
              <Button onClick={() => navigate('/dashboard')}>{t('startUsing')}</Button>
            ) : (
              // if not logged in
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
