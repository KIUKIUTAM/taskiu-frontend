// Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageChangeButton from '@/components/languageChangeButton';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAuth } from '@/hooks/auth/useAuth';

// FIX: Updated type definition to accept 'HTMLElement | null'
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { mutate: logout } = useLogout();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: user, isLoading, isError } = useAuth();

  const { t } = useTranslation('common');
  const navigate = useNavigate();

  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-blue-950 filter drop-shadow-lg">
                TasKiu
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-16"></nav>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageChangeButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
