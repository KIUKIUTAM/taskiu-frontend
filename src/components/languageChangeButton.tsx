import { useTranslation } from 'react-i18next';
import languageIcon from '@/assets/icons/language.svg';

function LanguageChangeButton() {
  type Locale = 'en' | 'tw';
  const { i18n } = useTranslation('common');
  const changeLanguage = (lng: Locale) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="relative inline-block group">
      <button className="px-3 py-1 items-center justify-center rounded-md border-2 border-blue-950 bg-white text-blue-950 group group-hover:bg-blue-950 transition-colors duration-100">
        <div
          className="w-5 h-5 bg-blue-950 group-hover:bg-white transition-colors duration-100"
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
      </button>
      <div className="hidden absolute right-0 w-32 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 group-hover:block">
        <div className="py-1">
          <button
            onClick={() => changeLanguage('en')}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('tw')}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            繁體中文
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguageChangeButton;
