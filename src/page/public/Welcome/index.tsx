import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation('page.public.welcome');
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl text-center">
          {t('subtitle')}
        </p>
      </div>
    </>
  );
}

export default Welcome;
