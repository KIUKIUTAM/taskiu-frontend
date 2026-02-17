import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider as QueryChientProvider } from '@tanstack/react-query';
import routes from '@/router/index';
import '@/global.css';
import '@/config/i18n/config.js';
import queryClient from '@/config/queryClient';
import { App as AntdApp } from 'antd';

const router = createBrowserRouter(routes, {
  basename: "/taskiu"
});


createRoot(document.getElementById('root')!).render(
  <AntdApp>
    <QueryChientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryChientProvider>
  </AntdApp>,
);
