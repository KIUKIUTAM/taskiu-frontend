// Header.tsx
import React, { useState, useEffect } from 'react';
import LanguageChangeButton from '@/components/languageChangeButton';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
                onClick={() => navigate('/')}
              >
                TasKiu
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-16"></nav>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageChangeButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-stretch">
            <LanguageChangeButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
