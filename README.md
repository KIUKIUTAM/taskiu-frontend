# Taskiu Frontend — React 19, Vite, Tailwind

Modern, responsive frontend for Taskiu built with React 19 and Vite, featuring enterprise-grade state management, routing, and i18n support.

## Overview
- React 19 with TypeScript and Vite 7 for fast DX
- Tailwind CSS v4 for utility-first styling
- Ant Design v6 for robust UI components
- TanStack Query v5 for server-state management (caching, revalidation)
- Zustand for lightweight global state
- React Router v7 for nested routing and lazy loading
- i18next for multilingual support (EN/TW)
- Axios client with JWT injection and refresh handling

## Tech Stack
- Core: React 19, Vite 7, TypeScript ([package.json](file:///f:/taskiu/taskiu-frontend/package.json))
- Styling: Tailwind CSS v4, Ant Design v6
- Data: TanStack Query v5, Axios
- State: Zustand
- Forms: React Hook Form + Zod
- i18n: i18next, language detector, HTTP backend
- Icons: Lucide React
- Bot protection: Cloudflare Turnstile

## Notable Implementations
- Auth user fetching via TanStack Query ([useAuth.tsx](file:///f:/taskiu/taskiu-frontend/src/hooks/auth/useAuth.tsx))
- Axios with request/response interceptors and queued token refresh ([api-client.ts](file:///f:/taskiu/taskiu-frontend/src/api/api-client.ts))
- Registration form with Zod validation and Turnstile verification ([EmailRegisterForm.tsx](file:///f:/taskiu/taskiu-frontend/src/components/auth/register/EmailRegisterForm.tsx))
- Protected workplace layout behind AuthGuard with lazy routes ([router/index.tsx](file:///f:/taskiu/taskiu-frontend/src/router/index.tsx))
- Global user store using Zustand ([userStore.tsx](file:///f:/taskiu/taskiu-frontend/src/stores/userStore.tsx))

## Scripts
```bash
# development
yarn dev

# production build
yarn build

# preview
yarn preview

# lint
yarn lint

# mock server
yarn server
```

## Environment Variables
Create `.env.development` with:
- `VITE_API_BASE_URL` — Backend API base URL
- Cloudflare Turnstile keys in config files if applicable

## Project Structure
- `src/api/` — API clients and Axios configuration
- `src/components/` — Shared UI components and auth flows
- `src/hooks/` — Custom hooks (auth, query, forms)
- `src/page/` — Public/stateless/workplace pages and layouts
- `src/router/` — Route definitions and guards
- `src/stores/` — Zustand global state
- `public/locales/` — i18n resource files

## Development
### Prerequisites
- Node.js 20+, Yarn

### Run Locally
```bash
yarn install
yarn dev
```

## Notes
- Backend/Frontend orchestration via [docker-compose.yaml](file:///f:/taskiu/docker-compose.yaml)
- Nginx reverse proxy configured in [nginx.conf](file:///f:/taskiu/nginx.conf)
