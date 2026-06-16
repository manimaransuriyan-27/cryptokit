import {
  InvalidVerificationLinkFeedbackPage,
  LinkAlreadyUsedFeedbackPage,
  LinkExpiredFeedbackPage,
  RegistrationAlreadyCompletedFeedbackPage,
  ResumeRegistrationCompletionFeedbackPage,
} from '@/components/feedback/error';
import { useTypedLocation } from '@/hooks/typed-hooks';
import type {
  VerifyEmailErrorFeedbackState,
  VerifyEmailSuccessFeedbackState,
} from '@/types/auth';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';

const VerifyEmailFeedbackPage = observer(() => {
  const location = useTypedLocation<
    VerifyEmailErrorFeedbackState | VerifyEmailSuccessFeedbackState
  >();
  const code = location?.state?.code;

  if (!code) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="items- flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'INVALID_VERIFICATION_LINK' ? (
        <InvalidVerificationLinkFeedbackPage />
      ) : code === 'LINK_ALREADY_USED' ? (
        <LinkAlreadyUsedFeedbackPage />
      ) : code === 'LINK_EXPIRED' ? (
        <LinkExpiredFeedbackPage />
      ) : code === 'REGISTRATION_ALREADY_COMPLETED' ? (
        <RegistrationAlreadyCompletedFeedbackPage />
      ) : code === 'RESUME_REGISTRATION_COMPLETION' ? (
        <ResumeRegistrationCompletionFeedbackPage />
      ) : (
        <Navigate to="/access-denied" replace />
      )}
    </div>
  );
});

export default VerifyEmailFeedbackPage;
