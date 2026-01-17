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
  const { data: user } = useAuth(); // 這裡不需要 isLoading, isError，只要 user

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

  // 1. 判斷是否已驗證
  const isVerified = !!user?.verified;

  // 2. 如果未驗證，navItems 為空陣列 (這樣 Desktop 和 Mobile 都不會顯示導航連結)
  const navItems = isVerified
    ? [
        { label: t('home'), href: '/dashboard' },
        { label: t('missions'), href: '/dashboard/missions' },
        { label: t('team'), href: '/dashboard/team' },
      ]
    : [];

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
            // 如果未驗證，點擊 Logo 還是去 dashboard (會被 AuthGuard 攔截回 verify-email)，或者你可以改成不跳轉
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-blue-950 filter drop-shadow-lg">
                TasKiu
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {/* 因為 navItems 變空了，未驗證時這裡自然不會渲染任何按鈕 */}
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
                      referrerPolicy="no-referrer"
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

                  {/* 3. 只有驗證過才顯示 Profile 和 Settings */}
                  {isVerified && (
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/dashboard/profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/dashboard/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        Settings
                      </button>
                    </div>
                  )}

                  {/* Logout 永遠顯示 */}
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
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200"
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Action Buttons */}
          <div className="pt-4 border-t border-gray-100 mt-2">
            <div className="flex items-center px-4 py-3 mb-2">
              {user?.picture && (
                <img
                  className="h-8 w-8 rounded-full mr-3"
                  src={user.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                />
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
