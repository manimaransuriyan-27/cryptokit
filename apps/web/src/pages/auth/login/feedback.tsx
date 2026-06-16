import {
  AccountBannedFeedbackPage,
  AccountSuspendedFeedbackPage,
} from '@/components/feedback/error';
import { useTypedLocation } from '@/hooks/typed-hooks';
import type { LoginErrorFeedbackState } from '@/types';
import { Navigate } from 'react-router-dom';

const LoginFeedbackPage = () => {
  const location = useTypedLocation<LoginErrorFeedbackState>();
  const code = location?.state?.code;

  if (!code) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="items- flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'ACCOUNT_BANNED' ? (
        <AccountBannedFeedbackPage />
      ) : code === 'ACCOUNT_SUSPENDED' ? (
        <AccountSuspendedFeedbackPage />
      ) : (
        <Navigate to="/access-denied" replace />
      )}
    </div>
  );
};

export default LoginFeedbackPage;
