import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ant Design Imports
import { Button, ConfigProvider, Dropdown, Avatar, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

// Hooks & Components
import LanguageChangeButton from '@/components/languageChangeButton';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAuth } from '@/hooks/auth/useAuth';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { mutate: logout } = useLogout();
  const { data: user } = useAuth();

  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { token } = theme.useToken();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Check if verified
  const isVerified = !!user?.verified;

  // 2. If not verified, navItems is empty
  const navItems = isVerified
    ? [
        { label: t('home'), href: '/dashboard' },
        // { label: t('missions'), href: '/missions' },
        { label: t('team'), href: '/team' },
      ]
    : [];

  // 3. User Dropdown Menu Items (Antd)
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div
          className="flex flex-col px-1 py-1 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {user?.name && <span className="font-semibold text-gray-900">{user.name}</span>}
          {user?.email && <span className="text-xs text-gray-500">{user.email}</span>}
        </div>
      ),
      type: 'group',
    },
    { type: 'divider' },
    ...(isVerified
      ? [
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => navigate('/dashboard/profile'),
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/dashboard/settings'),
          },
        ]
      : []),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#172554', // blue-950
          borderRadius: 6,
        },
      }}
    >
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

            {/* Desktop Navigation - Strictly keep original Tailwind animation */}
            <nav className="hidden lg:flex items-center space-x-1 ml-16">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="relative px-4 py-2 text-gray-700 font-medium text-sm xl:text-base hover:text-blue-950 transition-colors duration-300 group"
                >
                  {item.label}
                  {/* The span below is key for the underline animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-950 group-hover:w-full transition-all duration-100"></span>
                </button>
              ))}
            </nav>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageChangeButton />

              {/* User Avatar Dropdown (Ant Design) */}
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
                classNames={{ root: 'w-56' }}
              >
                <div className="cursor-pointer transition-transform active:scale-95">
                  <Avatar
                    size={40}
                    src={<img src={user?.picture} referrerPolicy="no-referrer" alt="avatar" />}
                    icon={!user?.picture && <UserOutlined />}
                    className="border-2 border-gray-200 hover:border-blue-950 transition-colors bg-gray-200"
                  />
                </div>
              </Dropdown>
            </div>

            {/* Mobile Menu Button (Antd Icon) */}
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

        {/* Mobile Navigation - Internally use Antd Button */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                type="text" // Use text type to make it look like list item
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

            {/* Mobile User Info & Logout */}
            <div className="pt-4 mt-2 border-t border-gray-100">
              <div className="flex items-center px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                <Avatar src={user?.picture} icon={<UserOutlined />} className="mr-3 bg-gray-300" />
                <div className="overflow-hidden">
                  {user?.name && (
                    <div className="text-sm font-medium text-gray-800 truncate">{user.name}</div>
                  )}
                  {user?.email && (
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  )}
                </div>
              </div>

              {isVerified && (
                <>
                  <Button
                    type="text"
                    block
                    icon={<ProfileOutlined />}
                    className="text-left justify-start text-gray-600"
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    type="text"
                    block
                    icon={<SettingOutlined />}
                    className="text-left justify-start text-gray-600"
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Settings
                  </Button>
                </>
              )}

              <Button
                type="text"
                danger
                block
                icon={<LogoutOutlined />}
                className="text-left justify-start mt-1"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
    </ConfigProvider>
  );
};

export default Header;
