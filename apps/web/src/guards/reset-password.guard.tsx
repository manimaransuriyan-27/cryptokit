import { Navigate, Outlet } from 'react-router-dom';

const ResetPasswordGuard = () => {
  const hasPassedVerification = true;
  if (!hasPassedVerification) {
    return <Navigate to="/forgot-password" replace />;
  }
  return <Outlet />;
};

export default ResetPasswordGuard;
