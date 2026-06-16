import { ErrorBoundary } from '@/components/error-boundary';
import AuthPageLoader from '@/components/ui/auth-loader';
import { useAuthStore } from '@/hooks/common/use-auth-store';
import { useTypedNavigate } from '@/hooks/typed-hooks';
import { getQueryClient } from '@/lib/query-client';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = observer(() => {
  const authStore = useAuthStore();
  const navigate = useTypedNavigate();

  useEffect(() => {
    const handleUnauthorized = (_e: Event) => {
      const queryClient = getQueryClient();
      queryClient.removeQueries();
      authStore.clearSession();
      navigate('/auth/gz/login', { replace: true });
    };

    window.addEventListener('app:unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('app:unauthorized', handleUnauthorized);
  }, [navigate]);

  if (authStore.loggingOut) {
    return <AuthPageLoader message="Logging you out securely..." />;
  }

  return (
    <div className='ck-app-shell__root-container'>
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
});

export default RootLayout;
