import { lazy, Suspense } from 'react';
import { Loader } from 'lucide-react';
import Welcome from '@/page/public/Welcome/index';
import Layout from '@/page/public/Layout/index';
import About from '@/page/public/About/index';
import Services from '@/page/public/Services/index';
import Contact from '@/page/public/Contact/index';
import { RegisterPage } from '@/page/stateless/Register/index';

import StateLessLayout from '@/page/stateless/Layout/index';
import DashLayout from '@/page/workplace/Layout/index';
const EmailVerification = lazy(() => import('@/page/stateless/EmailVerification/index'));
const DashboardHome = lazy(() => import('@/page/workplace/Home/index'));
const MissionsPage = lazy(() => import('@/page/workplace/Missions/index'));
const TermsPage = lazy(() => import('@/page/public/terms/index'));
import NotFound from '@/page/public/NotFount/index';

import Test from '@/page/Test/index.jsx';
import TodoList from '@/page/Test/tailwindcss';
import { GoogleCallbackPage } from '@/components/auth/google/GoogleCallback';
import { GitHubCallbackPage } from '@/components/auth/github/GitHubCallback';
import { AuthGuard } from '@/components/AuthGuard';
import { useTranslation } from 'react-i18next';

const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="animate-spin w-8 h-8 text-gray-600" />
      <div className="text-xl">{t('loading')}...</div>
    </div>
  );
};
const routes = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
  {
    element: <StateLessLayout />,
    children: [
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmailVerification />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardHome />
          </Suspense>
        ),
      },
      {
        path: 'missions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MissionsPage />
          </Suspense>
        ),
      },
      {
        path: 'team',
        element: <div>Team Page - Under Construction</div>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: 'test',
    element: <Test />,
  },
  {
    path: 'auth/google-callback',
    element: <GoogleCallbackPage />,
  },
  {
    path: 'auth/github-callback',
    element: <GitHubCallbackPage />,
  },
  {
    path: 'todos',
    element: <TodoList />,
  },
];

export default routes;
