import { useTranslation } from 'react-i18next';

function Services() {
  const { t } = useTranslation('page.public.services');
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
      <div className="text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{t('title')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
      </div>
    </div>
  );
}

export default Services;
