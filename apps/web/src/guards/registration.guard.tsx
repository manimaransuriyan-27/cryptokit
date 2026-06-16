import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';

export const RegistrationGuard = observer(() => {
  const hasValidStepState = true;
  if (!hasValidStepState) {
    return <Navigate to="/register" replace />;
  }
  return <Outlet />;
});
