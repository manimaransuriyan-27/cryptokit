import { observer } from 'mobx-react-lite';
import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import SuspenseLoader from '@/components/ui/suspense-loader';
import { useAuthStore } from '@/hooks/common/use-auth-store';
import { loginOtpInteractor } from './interactor';
//
const LoginOtpForm = lazy(() => import('@repo/shared/forms/login-otp.form'));

const LoginOtpPage = observer(() => {
  const { hasPendingOtp } = useAuthStore();

  if (!hasPendingOtp) {
    return <Navigate to="/auth/gz/login" replace />;
  }

  const {
    isSubmitting,
    isResending,
    contextHolder,
    onLoginOtp,
    resendLoginOtp,
  } = loginOtpInteractor();

  return (
    <Suspense fallback={<SuspenseLoader />}>
      {contextHolder}
      <LoginOtpForm
        onSubmit={onLoginOtp}
        isSubmitting={isSubmitting}
        isResending={isResending}
        onResendOtp={resendLoginOtp}
      />
    </Suspense>
  );
});

LoginOtpPage.displayName = 'LoginOtpPage';

export default LoginOtpPage;
