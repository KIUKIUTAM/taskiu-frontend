import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { EmailRegisterForm } from '@/components/auth/register/EmailRegisterForm';

export const RegisterPage: React.FC = () => {
  const { t: tPage } = useTranslation('page.stateless.register');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative top-12">
      <button
        onClick={handleBack}
        className="sticky top-24 left-6 self-start flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium z-40 ml-6 mt-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden lg:flex">{tCommon('back')}</span>
      </button>

      {/* Page Title Area */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {tPage('title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {tPage('subtitle')}
        </p>
      </div>

      {/* Main Card Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md pb-10">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <EmailRegisterForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {tPage('alreadyHaveAccount')}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                {tCommon('signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
