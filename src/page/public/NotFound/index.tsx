import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation('page.public.notFound');
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
};

export default NotFound;
