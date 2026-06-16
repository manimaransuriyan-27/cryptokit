import { RESEND_LOGIN_OTP_KEYS } from '@/lib/query-keys';
import { resendLoginOtpService } from '@/services/auth.service';
import type { ResendLoginOtpCredentials, ResendLoginOtpError } from '@/types';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

type ResendLoginOtpMutationResponse = Awaited<
  ReturnType<typeof resendLoginOtpService>
>;

export const useResendLoginOtpMutation = (
  options?: UseMutationOptions<
    ResendLoginOtpMutationResponse,
    ResendLoginOtpError,
    ResendLoginOtpCredentials
  >
) => {
  return useMutation({
    mutationKey: RESEND_LOGIN_OTP_KEYS,
    mutationFn: resendLoginOtpService,
    ...options,
  });
};
