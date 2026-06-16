import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/queries/auth-session';

const AuthGuard = observer(() => {
  const { isAuthenticated } = useSession({ enabled: true });

  if (!isAuthenticated) {
    return <Navigate to="/auth/gz/login" replace state={{ from: location }} />;
  }

  return (
    <div className="animate-in duration-500 fade-in">
      <Outlet />
    </div>
  );
});

export default AuthGuard;
