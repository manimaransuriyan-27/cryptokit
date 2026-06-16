import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAppNotification } from '@/hooks/common/use-notifications';
import { authMutations } from '@/hooks/mutations/auth';
import { useTypedNavigate } from '@/hooks/typed-hooks';
import type { HandlerContext, InitiateRegistrationErrorResponse, InitiateRegistrationSuccessResponse, ResponseHandler } from '@/types/auth';
import { INITIATE_REGISTRATION_ERROR_HANDLERS, INITIATE_REGISTRATION_SUCCESS_HANDLERS, type InitiateRegistrationErrorHandlersPayloadType } from './config';

export const useInitiateRegistrationInteractor = () => {
  const navigate = useTypedNavigate();
  const notification = useAppNotification();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/auth/gz/register/verify-email';


  const ctx: HandlerContext = {
    queryClient,
    navigate,
    notification,
    redirectTo,
  };

  const handleInitiateRegistrationSuccess = (response: InitiateRegistrationSuccessResponse) => {
    const handler = INITIATE_REGISTRATION_SUCCESS_HANDLERS[response.code] as ResponseHandler<
      typeof response
    >;
    return handler(response, ctx);
  }

  const handleInitiateRegistrationError = (error: InitiateRegistrationErrorResponse) => {
    const code = error?.response?.data?.code;

    if (!code || !(code in INITIATE_REGISTRATION_ERROR_HANDLERS)) {
      notification.error('Unexpected Error', 'Something went wrong.');
      return;
    }

    const payload = { code } as InitiateRegistrationErrorHandlersPayloadType;
    const handler = INITIATE_REGISTRATION_ERROR_HANDLERS[code] as ResponseHandler<
      typeof payload
    >;
    return handler(payload, ctx);
  }

  const initiateRegistrationMutation = authMutations.initiateRegistration({
    onSuccess: handleInitiateRegistrationSuccess,
    onError: handleInitiateRegistrationError,
  });

  return {
    onInitiateRegistration: initiateRegistrationMutation.mutate,
    isSubmitting: initiateRegistrationMutation.isPending,
    contextHolder: notification.notificationContextHolder,
  }
};
