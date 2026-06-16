import AccountSuspended from '@/components/feedback/error/account-suspended';
import AccountBannedPage from '@/components/feedback/error/account-banned';
import { useTypedLocation } from '@/hooks/typed-hooks';
import type { LoginErrorFeedbackState } from '@/types';
import { Navigate } from 'react-router-dom';

const LoginFeedbackPage = () => {
  const location = useTypedLocation<LoginErrorFeedbackState>();
  const code = location?.state?.code;

  console.log('Location:', location, 'Code:', code);

  if (!code) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="items- flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'ACCOUNT_BANNED' ? (
        <AccountBannedPage />
      ) : code === 'ACCOUNT_SUSPENDED' ? (
        <AccountSuspended />
      ) : (
        <Navigate to="/access-denied" replace />
      )}
    </div>
  );
};

LoginFeedbackPage.displayName = 'LoginFeedbackPage';

export default LoginFeedbackPage;
