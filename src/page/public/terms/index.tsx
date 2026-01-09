import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation('terms');

  const sections = t('sections', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 卡片容器 */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* 標題區域 Header */}
        <div className="bg-white px-6 py-8 sm:px-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-500">{t('lastUpdated')}</p>
        </div>

        {/* 內容區域 Content */}
        <div className="px-6 py-8 sm:px-10 space-y-8">
          {Array.isArray(sections) ? (
            sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                <div className="text-gray-600 leading-relaxed text-justify">{section.content}</div>
              </section>
            ))
          ) : (
            <p className="text-red-500">{t('loadingError')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
