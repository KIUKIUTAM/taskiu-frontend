import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider as QueryChientProvider } from '@tanstack/react-query';
import routes from '@/router/index';
import '@/global.css';
import '@/features/i18n/config.js';
import queryClient from '@/api/queryClient';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <QueryChientProvider client={queryClient}>
    <RouterProvider router={router}></RouterProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryChientProvider>,
);
