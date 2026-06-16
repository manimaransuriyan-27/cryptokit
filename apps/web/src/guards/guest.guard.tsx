import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/queries/auth-session';
import Spinner4 from '@repo/shared/components/spinner4';

const GuestGuard = observer(() => {
  const { isAuthenticated, isInitialized } = useSession({ enabled: false });

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <Spinner4 className="h-7 w-7 animate-spin text-gray-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/sz/dashboard" replace />;
  }

  return <Outlet />;
});

export default GuestGuard;
