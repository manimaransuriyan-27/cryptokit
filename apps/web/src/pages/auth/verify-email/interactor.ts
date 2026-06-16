import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAppNotification } from '@/hooks/common/use-notifications';
import { useTypedNavigate } from '@/hooks/typed-hooks';
import type { HandlerContext, ResponseHandler, VerifyEmailErrorResponse, VerifyEmailSuccessResponse } from '@/types/auth';
import { VERIFY_EMAIL_ERROR_HANDLERS, VERIFY_EMAIL_SUCCESS_HANDLERS, type VerifyEmailErrorHandlersPayloadType } from './config';
import { authMutations } from '@/hooks/mutations/auth';

export const useVerifyEmailInteractor = () => {
  const navigate = useTypedNavigate();
  const notification = useAppNotification();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/access-denied';

  const ctx: HandlerContext = {
    queryClient,
    navigate,
    notification,
    redirectTo,
  }

  const handleVerifyEmailSuccess = (response: VerifyEmailSuccessResponse) => {
    const handler = VERIFY_EMAIL_SUCCESS_HANDLERS[response.code] as ResponseHandler<
      typeof response
    >;
    return handler(response, ctx);
  }

  const handleVerifyEmailError = (error: VerifyEmailErrorResponse) => {
    const code = error?.response?.data?.code;
    if (!code || !(code in VERIFY_EMAIL_ERROR_HANDLERS)) {
      notification.error('Unexpected Error', 'Something went wrong.');
      return;
    }
    const payload = { code } as VerifyEmailErrorHandlersPayloadType;
    const handler = VERIFY_EMAIL_ERROR_HANDLERS[code] as ResponseHandler<
      typeof payload
    >;
    return handler(payload, ctx);
  }

  const verifyEmailMutation = authMutations.verifyEmail({
    onSuccess: handleVerifyEmailSuccess,
    onError: handleVerifyEmailError,
  });

  return {
    onVerifyEmail: verifyEmailMutation.mutate,
    isSubmitting: verifyEmailMutation.isPending,
    contextHolder: notification.notificationContextHolder,
  }
}
