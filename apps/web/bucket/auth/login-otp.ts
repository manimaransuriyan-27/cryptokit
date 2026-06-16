import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { LOGIN_OTP_KEYS } from '@/lib/query-keys';
import { loginOtpService } from '@/services/auth.service';
import type { LoginOtpCredentials, LoginOtpErrorResponse } from '@/types/auth';

type LoginOtpMutationResponse = Awaited<ReturnType<typeof loginOtpService>>;

export const useLoginOtpMutation = (
  options?: UseMutationOptions<
    LoginOtpMutationResponse,
    LoginOtpErrorResponse,
    LoginOtpCredentials
  >
) => {
  return useMutation({
    mutationKey: LOGIN_OTP_KEYS,
    mutationFn: loginOtpService,
    ...options,
  });
};
