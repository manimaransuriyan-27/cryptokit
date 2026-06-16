import { createBrowserRouter } from 'react-router-dom';
import { RouteErrorFallback } from '@/components/error-boundary';
import AuthGuard from '@/guards/auth.guard';
import GuestGuard from '@/guards/guest.guard';
import AuthLayout from '@/layouts/auth.layout';
import RootLayout from '@/layouts/root.layout';
import { lazyModule } from '@repo/hooks';
import { PageNotFound } from '@repo/shared/components/page-not-found';
import { LoaderIcon } from 'lucide-react';
import { completeRegistrationLoader } from './loaders/registration.loader';
import { requireAuthLoader } from './loaders/require-auth.loader';
import { verifyLoginOtpLoader } from './loaders/login-otp.loader';

export const RouteHydrateFallback = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className="size-4 h-7 w-7 animate-spin text-zinc-400 opacity-80"
    />
  </div>
);

export const createAppRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: '/',
        lazy: lazyModule(() => import('@/pages/home/home.page')),
      },
      {
        element: <GuestGuard />,
        errorElement: <RouteErrorFallback />,
        children: [
          {
            path: '/auth/gz',
            element: <AuthLayout />,
            errorElement: <RouteErrorFallback />,
            children: [
              {
                path: 'login',
                lazy: lazyModule(() => import('@/pages/auth/login/page')),
              },
              {
                loader: verifyLoginOtpLoader,
                path: 'login/verify-otp',
                lazy: lazyModule(() => import('@/pages/auth/login-otp/page')),
              },
              {
                path: 'login/feedback',
                lazy: lazyModule(
                  () => import('@/pages/auth/feedback/login.fb')
                ),
              },
              {
                path: 'register/initiate-registration',
                lazy: lazyModule(
                  () => import('@/pages/auth/initiate-registration/page')
                ),
              },
              {
                path: 'register/initiate-registration/feedback',
                lazy: lazyModule(
                  () => import('@/pages/auth/initiate-registration/feedback')
                ),
              },
              {
                path: 'register/verify-email',
                lazy: lazyModule(
                  () => import('@/pages/auth/verify-email/page')
                ),
              },
              {
                path: 'register/verify-email/feedback',
                lazy: lazyModule(
                  () => import('@/pages/auth/verify-email/feedback')
                ),
              },
              {
                loader: completeRegistrationLoader,
                hydrateFallbackElement: <RouteHydrateFallback />,
                errorElement: <RouteErrorFallback />,
                children: [
                  {
                    path: 'register/complete-registration',
                    lazy: lazyModule(
                      () => import('@/pages/auth/complete-registration/page')
                    ),
                  },
                  {
                    path: 'register/complete-registration/feedback',
                    lazy: lazyModule(
                      () => import('../../bucket/complete-registration.fb')
                    ),
                  },
                ],
              },
              {
                path: 'forgot-password',
                lazy: lazyModule(
                  () => import('@/pages/auth/forgot-password/page')
                ),
              },
            ],
          },
        ],
      },
      {
        loader: requireAuthLoader,
        element: <AuthGuard />,
        errorElement: <RouteErrorFallback />,
        children: [
          {
            path: '/sz',
            children: [
              {
                path: 'dashboard',
                lazy: lazyModule(() => import('@/pages/dashboard/page')),
              },
            ],
          },
        ],
      },
      {
        path: 'access-denied',
        lazy: lazyModule(() => import('@/components/unauthorized.fb')),
      },
    ],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
