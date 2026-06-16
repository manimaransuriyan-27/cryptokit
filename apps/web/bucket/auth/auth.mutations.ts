import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { LOGIN_KEYS, LOGIN_OTP_KEYS } from '@/lib/query-keys';
import { loginOtpService, loginService } from '@/services/auth.service';
import type {
  LoginErrorResponse,
  LoginCredentials,
  LoginOtpCredentials,
  LoginOtpErrorResponse,
} from '@/types/auth';

export const authMutations = {
  login: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof loginService>>,
      LoginErrorResponse,
      LoginCredentials
    >
  ) => {
    return useMutation({
      mutationKey: LOGIN_KEYS,
      mutationFn: loginService,
      ...options,
    });
  },
  loginOtp: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof loginOtpService>>,
      LoginOtpErrorResponse,
      LoginOtpCredentials
    >
  ) => {
    return useMutation({
      mutationKey: LOGIN_OTP_KEYS,
      mutationFn: loginOtpService,
      ...options,
    });
  },
};