import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation('page.workplace.home');
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('welcomeBack')}</h2>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('cards.coursesTitle')}</h3>
            <p className="text-gray-600">{t('cards.coursesDesc')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('cards.progressTitle')}</h3>
            <p className="text-gray-600">{t('cards.progressDesc')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('cards.achievementsTitle')}</h3>
            <p className="text-gray-600">{t('cards.achievementsDesc')}</p>
          </div>
        </div>
        <button className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          test
        </button>
      </main>
    </div>
  );
};

export default HomePage;
