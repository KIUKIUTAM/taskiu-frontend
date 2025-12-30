import Welcome from '@/page/public/Welcome/index';
import Layout from '@/page/public/Layout/index';
import About from '@/page/public/About/index';
import Services from '@/page/public/Services/index';
import Contact from '@/page/public/Contact/index';

import DashLayout from '@/page/workplace/Layout/index';
import DashboardHome from '@/page/workplace/Home/index';
import MissionsPage from '@/page/workplace/Missions/index';

import NotFound from '@/page/public/NotFount/index';

import TransitionComparison from '@/page/Test/index.jsx';
import TodoList from '@/page/Test/tailwindcss';
import { CallbackPage } from '@/components/auth/Callback';
import { AuthGuard } from '@/components/AuthGuard';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
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
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'missions',
        element: <MissionsPage />,
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
    element: <TransitionComparison />,
  },
  {
    path: 'callback',
    element: <CallbackPage />,
  },
  {
    path: 'todos',
    element: <TodoList />,
  },
];

export default routes;
