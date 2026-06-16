// src/guards/otp.guard.tsx
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

const LoginOtpGuard = observer(() => {
  // const { hasPendingOtp } = rootStore.authStore;
  // if (!hasPendingOtp) {
  //   return <Navigate to="/auth/login" replace />;
  // }
  return <Outlet />;
});

export default LoginOtpGuard;
