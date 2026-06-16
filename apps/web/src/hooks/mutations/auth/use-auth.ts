import {
  COMPLETE_REGISTRATION_KEYS,
  INITIATE_REGISTRATION_KEYS,
  LOGIN_KEYS,
  LOGIN_OTP_KEYS,
  LOGOUT_KEYS,
  RESEND_LOGIN_OTP_KEYS,
  VERIFY_EMAIL_KEYS,
} from '@/lib/query-keys';
import * as authSevice from '@/services/auth.service';
import type {
  CompleteRegistrationCredentials,
  CompleteRegistrationErrorResponse,
  InitiateRegistrationCredentials,
  InitiateRegistrationErrorResponse,
  LoginCredentials,
  LoginErrorResponse,
  LoginOtpCredentials,
  LoginOtpErrorResponse,
  LogoutErrorResponse,
  ResendLoginOtpErrorResponse,
  VerifyEmailCredentials,
  VerifyEmailErrorResponse,
} from '@/types/auth';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export const authMutations = {
  login: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.loginService>>,
      LoginErrorResponse,
      LoginCredentials
    >
  ) => {
    return useMutation({
      mutationKey: LOGIN_KEYS,
      mutationFn: authSevice.loginService,
      ...options,
    });
  },
  logout: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.logoutService>>,
      LogoutErrorResponse,
      void
    >
  ) => {
    return useMutation({
      mutationKey: LOGOUT_KEYS,
      mutationFn: authSevice.logoutService,
      ...options,
    });
  },
  loginOtp: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.loginOtpService>>,
      LoginOtpErrorResponse,
      LoginOtpCredentials
    >
  ) => {
    return useMutation({
      mutationKey: LOGIN_OTP_KEYS,
      mutationFn: authSevice.loginOtpService,
      ...options,
    });
  },
  resendLoginOtp: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.resendLoginOtpService>>,
      ResendLoginOtpErrorResponse,
      void
    >
  ) => {
    return useMutation({
      mutationKey: RESEND_LOGIN_OTP_KEYS,
      mutationFn: authSevice.resendLoginOtpService,
      ...options,
    });
  },
  initiateRegistration: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.initiateRegistrationService>>,
      InitiateRegistrationErrorResponse,
      InitiateRegistrationCredentials
    >
  ) => {
    return useMutation({
      mutationKey: INITIATE_REGISTRATION_KEYS,
      mutationFn: authSevice.initiateRegistrationService,
      ...options,
    });
  },
  verifyEmail: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.verifyEmailService>>,
      VerifyEmailErrorResponse,
      VerifyEmailCredentials
    >
  ) => {
    return useMutation({
      ...options,
      mutationKey: VERIFY_EMAIL_KEYS,
      mutationFn: authSevice.verifyEmailService,
    });
  },
  completeRegistration: (
    options?: UseMutationOptions<
      Awaited<ReturnType<typeof authSevice.completeRegistrationService>>,
      CompleteRegistrationErrorResponse,
      CompleteRegistrationCredentials
    >
  ) => {
    return useMutation({
      ...options,
      mutationKey: COMPLETE_REGISTRATION_KEYS,
      mutationFn: authSevice.completeRegistrationService,
    });
  },
};
