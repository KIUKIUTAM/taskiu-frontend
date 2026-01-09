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

            {/* User Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 focus:outline-hidden transition-transform active:scale-95"
              >
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden hover:border-blue-500 transition-colors cursor-pointer">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black/5 transform origin-top-right transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    {user?.name && (
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    )}
                    {user?.email && (
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    )}
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-stretch">
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
          <div className="pt-4 border-t border-gray-100 mt-2">
            <div className="flex items-center px-4 py-3 mb-2">
              {user?.picture && (
                <img className="h-8 w-8 rounded-full mr-3" src={user.picture} alt="" />
              )}
              <div>
                {user?.name && <div className="text-sm font-medium text-gray-800">{user.name}</div>}
                {user?.email && <div className="text-xs text-gray-500">{user.email}</div>}
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="block w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
