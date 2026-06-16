import { useAuthStore } from '@/hooks/common/use-auth-store';
import { useAppNotification } from '@/hooks/common/use-notifications';
import { authMutations } from '@/hooks/mutations/auth';
import type {
  CompleteRegistrationCredentials,
  CompleteRegistrationError,
  CompleteRegistrationErrorCode,
  CompleteRegistrationSuccess,
  CompleteRegistrationSuccessFeedbackState,
} from '@/types';
import { useNavigate } from 'react-router-dom';
import { COMPLETE_REGISTRATION_CODE_CONFIG } from './config';

export const useCompleteRegistrationInteractor = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const notification = useAppNotification();

  // useEffect(() => {
  //   if (!completionToken) {
  //     navigate('/auth/register/initiate-registration', { replace: true });
  //   }
  // }, [completionToken]);

  const handleOnSuccess = (response: CompleteRegistrationSuccess) => {
    const config = COMPLETE_REGISTRATION_CODE_CONFIG[response.code];
    if (!config || !response.code) {
      notification.error('Error', 'Something went wrong.');
      return;
    }
    switch (config.type) {
      case 'page': {
        authStore.setRegistrationCompleted(true);
        authStore.setCompletionToken(null);
        navigate(config.nextPath, {
          replace: config.replaceOnEntry,
          state: {
            code: response.code,
          } satisfies CompleteRegistrationSuccessFeedbackState,
        });
        return;
      }
    }
  };

  const handleOnError = (error: CompleteRegistrationError) => {
    const code = error.response?.data?.code as CompleteRegistrationErrorCode;
    const config = COMPLETE_REGISTRATION_CODE_CONFIG[code];

    if (!config || !code) {
      notification.error('Error', 'Something went wrong..');
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
      case 'error': {
        notification.error('Error', config.message);
        return;
      }
    }
  };

  const completeRegistrationMutation = authMutations.completeRegistration({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const onCompleteRegistration = async (
    credentials: CompleteRegistrationCredentials
  ) => {
    // const completionToken = authStore.completionToken;
    // if (!completionToken) {
    //   notification.error('Error', 'Something went wrong..');
    //   return;
    // }
    await completeRegistrationMutation.mutateAsync(credentials);
  };

  return {
    notificationContextHolder: notification.notificationContextHolder,
    isSubmitting: completeRegistrationMutation.isPending,
    onCompleteRegistration,
  };
};
