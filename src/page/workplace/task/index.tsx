import { useTranslation } from 'react-i18next';

export function Task() {
  const { t } = useTranslation('page.workplace.task');
  return <div>{t('title')}</div>;
}
export default Task;
