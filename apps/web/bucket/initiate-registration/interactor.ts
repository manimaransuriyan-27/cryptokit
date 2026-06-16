import { useInitiateRegistrationMutation } from '@/hooks/mutations';
import { useAuthStore } from '@/hooks/common/use-auth-store';
import { useAppNotification } from '@/hooks/common/use-notifications';
import type {
  InitiateRegistrationError,
  InitiateRegistrationErrorCode,
  InitiateRegistrationErrorFeedbackState,
  InitiateRegistrationSuccess,
  InitiateRegistrationSuccessFeedbackState,
} from '@/types';
import type { RegisterInitiateSchemaType } from '@repo/shared/validators/auth.validator';
import { useNavigate } from 'react-router-dom';
import { INITIATE_REGISTRATION_RESPONSE_CONFIG } from './config';

export const useInitiateRegistrationInteractor = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const notification = useAppNotification();

  const handleOnSuccess = (response: InitiateRegistrationSuccess) => {
    const config = INITIATE_REGISTRATION_RESPONSE_CONFIG[response.code];
    if (!config || !response.code) {
      notification.error('Error', 'Something went wrong.');
      return;
    }
    switch (config.type) {
      case 'page': {
        authStore.setEmailId(response.data.email);
        authStore.setRegistrationInitiated(true);
        navigate(config.nextPath, {
          replace: config.replaceOnEntry,
          state: {
            code: response.code,
          } satisfies InitiateRegistrationSuccessFeedbackState,
        });
        return;
      }
      default: {
        notification.error('Error', 'Something went wrong.');
        return;
      }
    }
  };

  const handleOnError = (error: InitiateRegistrationError) => {
    const code = error.response?.data?.code as InitiateRegistrationErrorCode;
    const config = INITIATE_REGISTRATION_RESPONSE_CONFIG[code];

    if (!config || !code) {
      notification.error('Error', 'Something went wrong.');
      return;
    }

    switch (config.type) {
      case 'error': {
        notification.error('Error', config.message);
        return;
      }
      case 'page': {
        navigate(config.nextPath, {
          replace: config.replaceOnEntry,
          state: {
            code: code,
          } satisfies InitiateRegistrationErrorFeedbackState,
        });
        return;
      }
      default: {
        notification.error('Error', 'Something went wrong.');
        return;
      }
    }
  };

  const initiateRegistrationMutation = useInitiateRegistrationMutation({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const onInitiateRegistration = (credentials: RegisterInitiateSchemaType) => {
    initiateRegistrationMutation.mutate(credentials);
  };

  return {
    notificationContextHolder: notification.notificationContextHolder,
    isSubmitting: initiateRegistrationMutation.isPending,
    onInitiateRegistration,
  };
};
