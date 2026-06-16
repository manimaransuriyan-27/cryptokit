import { EmailAlreadyVerifiedFeedbackPage } from '@/components/feedback/error';
import { RegistrationInitiatedFeedbackPage } from '@/components/feedback/success';
import { useAuthBroadcast } from '@/hooks/common/use-auth-broadcast';
import { useTypedLocation } from '@/hooks/typed-hooks';
import { useRootStore } from '@/providers/store.provider';
import type {
  InitiateRegistrationErrorCode,
  InitiateRegistrationSuccessCode,
} from '@/types';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const InitiateRegistrationFeedbackPage = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useRootStore();

  const location = useTypedLocation<{
    code: InitiateRegistrationSuccessCode | InitiateRegistrationErrorCode;
  }>();
  const code = location.state?.code;

  useAuthBroadcast((data) => {
    if (data.event === 'EMAIL_VERIFIED') {
      navigate('/auth/gz/register/initiate-registration', { replace: true });
    }
  });

  if (!code) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="flex min-h-[80vh] w-full animate-in flex-col items-center justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'REGISTRATION_INITIATED' && authStore.preAuthEmail ? (
        <RegistrationInitiatedFeedbackPage />
      ) : code === 'EMAIL_ALREADY_VERIFIED' ? (
        <EmailAlreadyVerifiedFeedbackPage />
      ) : (
        <Navigate to="/access-denied" replace />
      )}
    </div>
  );
});

InitiateRegistrationFeedbackPage.displayName =
  'InitiateRegistrationFeedbackPage';

export default memo(InitiateRegistrationFeedbackPage);
