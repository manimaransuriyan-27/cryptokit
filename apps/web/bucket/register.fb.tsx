import RegisterInitiated from '@/components/register-initiated';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import type { RegisterInitiateFeedbackState } from '../src/pages/auth/config/register-initiate.config';

const AuthRegisterFeedback = observer(() => {
  const location = useLocation();
  const state = location.state as RegisterInitiateFeedbackState | null;
  const code = state?.code;

  if (!code) {
    return <Navigate to="/auth/access-denied" replace />;
  }

  return (
    <div className="items- flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'REGISTRATION_INITIATED' && <RegisterInitiated />}
    </div>
  );
});

AuthRegisterFeedback.displayName = 'AuthRegisterFeedback';

export default AuthRegisterFeedback;
