import { registerMutations } from "@/hooks/mutations/auth";
import { useAuthStore } from '@/hooks/common/use-auth-store';
import type {
  VerifyEmailError,
  VerifyEmailErrorCode,
  VerifyEmailSuccess,
  VerifyEmailSuccessFeedbackState,
} from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { VERIFY_REGISTER_EMAIL_CODE_CONFIG } from './config';
import { useAuthBroadcast } from '@/hooks/common/use-auth-broadcast';

export const useVerifyEmailInteractor = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const { emit } = useAuthBroadcast();

  const handleOnSuccess = (response: VerifyEmailSuccess) => {
    const completionToken = response.data.completionToken;
    const config = VERIFY_REGISTER_EMAIL_CODE_CONFIG[response.code];
    if (!config) {
      return;
    }
    switch (config.type) {
      case 'page': {
        authStore.setEmailVerified(true);
        authStore.setCompletionToken(completionToken);
        emit({
          event: 'EMAIL_VERIFIED',
          payload: { email: authStore.emailId ?? '' },
        });
        navigate(config.nextPath, {
          replace: config.replaceOnEntry,
          state: {
            code: response.code,
          } satisfies VerifyEmailSuccessFeedbackState,
        });
      }
    }
  };

  const handleOnError = (error: VerifyEmailError) => {
    const code = error.response?.data?.code as VerifyEmailErrorCode;
    const config = VERIFY_REGISTER_EMAIL_CODE_CONFIG[code];

    if (!config) {
      return;
    }
    switch (config.type) {
      case 'page': {
        navigate(config.nextPath, {
          replace: config.replaceOnEntry,
          state: {
            code,
          },
        });
        return;
      }
    }
  };

  const VerifyEmailMutation = registerMutations.verifyEmail({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  return {
    onVerifyEmail: VerifyEmailMutation.mutate,
  };
};
