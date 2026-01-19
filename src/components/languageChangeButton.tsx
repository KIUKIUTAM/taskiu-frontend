import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import languageIcon from '@/assets/icons/language.svg';

// 定義語言類型
type Locale = 'en' | 'tw';

const LanguageChangeButton: React.FC = () => {
  const { i18n } = useTranslation('common');

  const changeLanguage = (lng: Locale) => {
    i18n.changeLanguage(lng);
  };

  const items: MenuProps['items'] = [
    {
      key: 'en',
      label: 'English',
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'tw',
      label: '繁體中文',
      onClick: () => changeLanguage('tw'),
    },
  ];

  // Icon 使用 bg-current，這樣它的顏色會自動跟隨 Button 的文字顏色
  const CustomIcon = (
    <div
      className="w-5 h-5 bg-current transition-colors duration-100"
      style={{
        maskImage: `url(${languageIcon})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${languageIcon})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <Button
        className="flex items-center justify-center border-2 border-blue-950 text-blue-950 hover:!bg-blue-950 hover:!text-white hover:!border-blue-950"
        style={{ padding: '4px 12px', height: 'auto' }}
        icon={CustomIcon}
      />
    </Dropdown>
  );
};

export default LanguageChangeButton;
