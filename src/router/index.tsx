import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------
// 1. 靜態引入 (Static Imports)
// Layout、Guard 和 NotFound 建議保持靜態引入，避免畫面閃爍或 Layout Shift
// ----------------------------------------------------------------------
const StateLessLayout = lazy(() => import('@/page/stateless/Layout/index'));
const DashLayout = lazy(() => import('@/page/workplace/Layout/index'));
import { AuthGuard } from '@/components/AuthGuard';
import NotFound from '@/page/public/NotFound/index';

// 假設你的特效 Loading 元件放在這裡 (請替換成你實際的路徑)
import LoadingPage from '@/page/public/Loading'; 
import Layout from '@/page/public/Layout/index'; 
// ----------------------------------------------------------------------
// 2. 工具函數：強制延遲的 Lazy (專門給 Welcome 用)
// ----------------------------------------------------------------------
const lazyWithDelay = (importFunc: () => Promise<any>, minDelay: number = 2500) => {
  return lazy(() => Promise.all([
    importFunc(),
    new Promise(resolve => setTimeout(resolve, minDelay))
  ]).then(([moduleExports]) => moduleExports));
};

// ----------------------------------------------------------------------
// 3. Lazy Imports
// ----------------------------------------------------------------------

// 【特別處理】：只有 Welcome 頁面會強制等待 2.5 秒，展示特效
const Welcome = lazyWithDelay(() => import('@/page/public/Welcome/index'), 1000);

const About = lazy(() => import('@/page/public/About/index'));
const Services = lazy(() => import('@/page/public/Services/index'));
const Contact = lazy(() => import('@/page/public/Contact/index'));
const TermsPage = lazy(() => import('@/page/public/terms/index'));
const RegisterPage = lazy(() => import('@/page/stateless/Register/index'));
const TaskDetailPage = lazy(() => import('@/page/workplace/task'));

const EmailVerification = lazy(() => import('@/page/workplace/EmailVerification/index'));
const DashboardHome = lazy(() => import('@/page/workplace/Home/index'));
const MissionsPage = lazy(() => import('@/page/workplace/Missions/index'));
const TeamPage = lazy(() => import('@/page/workplace/Team/index'));
const TeamDetailPage = lazy(() => import('@/page/workplace/TeamDetail/index'));

const Test = lazy(() => import('@/page/Test/index.jsx'));
const TodoList = lazy(() => import('@/page/Test/tailwindcss'));
const GoogleCallbackPage = lazy(() => import('@/components/auth/google/GoogleCallback'));
const GitHubCallbackPage = lazy(() => import('@/components/auth/github/GitHubCallback'));

// ----------------------------------------------------------------------
// 4. Loading 元件與包裝工具
// ----------------------------------------------------------------------



const withSuspense = (Component: React.LazyExoticComponent<any>, Fallback: React.ReactNode = <LoadingPage />) => (
  <Suspense fallback={Fallback}>
    <Component />
  </Suspense>
);

// ----------------------------------------------------------------------
// 5. Routes Configuration
// ----------------------------------------------------------------------
const routes = [
  {
    element:  <Layout/>,
    children: [
      {
        index: true,
        element: withSuspense(Welcome),
      },
      {
        path: 'about',
        element: withSuspense(About),
      },
      {
        path: 'services',
        element: withSuspense(Services),
      },
      {
        path: 'contact',
        element: withSuspense(Contact),
      },
      {
        path: 'tasks',
        element: withSuspense(TaskDetailPage),
      }
    ],
  },
  {
    element: <StateLessLayout />,
    children: [
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
      {
        path: 'terms',
        element: withSuspense(TermsPage),
      },
    ],
  },
  {
    element: (
      <AuthGuard>
        <DashLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DashboardHome),
      },
      {
        path: 'missions',
        element: withSuspense(MissionsPage),
      },
      {
        path: 'team',
        element: withSuspense(TeamPage),
      },
      {
        path: 'team/:teamId',
        element: withSuspense(TeamDetailPage),
      },
      {
        path: 'verify-email',
        element: withSuspense(EmailVerification),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: 'test',
    element: withSuspense(Test),
  },
  {
    path: 'auth/google-callback',
    element: withSuspense(GoogleCallbackPage),
  },
  {
    path: 'auth/github-callback',
    element: withSuspense(GitHubCallbackPage),
  },
  {
    path: 'todos',
    element: withSuspense(TodoList),
  },
  {
    path: 'loading',
    element: <LoadingPage/>
  }
];

export default routes;
