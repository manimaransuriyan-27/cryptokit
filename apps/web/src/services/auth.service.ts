import { httpClient } from '@/lib/api-client';
import type {
  CompleteRegistrationApiResponse,
  GetCompletionStatusApiResponse,
  InitiateRegistrationApiResponse,
  InitiateRegistrationCredentials,
  ResumeCompletionOfRegistrationApiResponse,
  ResumeCompletionOfRegistrationCredentials,
  User
} from '@/types';
import type {
  LoginCredentials,
  LoginOtpCredentials,
  LoginOtpResponse,
  LoginOtpSessionStatusResponse,
  LoginResponse,
  ResendLoginOtpResponse,
  VerifyEmailApiResponse,
  VerifyEmailCredentials,
} from '@/types/auth';
import type { CompleteRegistrationSchemaType } from '@repo/shared/validators/auth.validator';

export const loginService = async (credentials: LoginCredentials) => {
  const response = await httpClient.post<LoginResponse>(
    'auth/login',
    credentials,
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const logoutService = async () =>
  await httpClient.post<LogoutResponse>('auth/logout', {
    _skipAuthRefresh: true,
  });

export const loginOtpService = async (credentials: LoginOtpCredentials) => {
  const response = await httpClient.post<LoginOtpResponse>(
    'auth/login/verify-otp',
    credentials,
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const resendLoginOtpService = async () => {
  const response = await httpClient.post<ResendLoginOtpResponse>(
    'auth/login/resend-otp',
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const initiateRegistrationService = async (
  credentials: InitiateRegistrationCredentials
) => {
  const response = await httpClient.post<InitiateRegistrationApiResponse>(
    'auth/register/initiate',
    credentials,
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const verifyEmailService = async (
  credentials: VerifyEmailCredentials
) => {
  const response = await httpClient.post<VerifyEmailApiResponse>(
    `auth/register/verify-email?token=${credentials.token}`
  );
  return response.data;
};

export const resumeCompletionOfRegistrationService = async (
  credentials: ResumeCompletionOfRegistrationCredentials
) => {
  const response =
    await httpClient.post<ResumeCompletionOfRegistrationApiResponse>(
      'auth/register/resume-completion',
      credentials,
      { _skipAuthRefresh: true }
    );
  return response.data;
};

export const completeRegistrationService = async (
  credentials: CompleteRegistrationSchemaType
) => {
  const response = await httpClient.post<CompleteRegistrationApiResponse>(
    'auth/register/complete',
    credentials,
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const getCompletionStatusService = async () => {
  const response = await httpClient.get<GetCompletionStatusApiResponse>(
    'auth/register/completion-status',
    { _skipAuthRefresh: true }
  );
  return response.data;
};

export const getMeService = async (): Promise<User> => {
  const response = await httpClient.get<User>('auth/me', {
    _skipAuthRefresh: true,
  });
  return response.data;
};

export const getLoginOtpSessionStatusService = async () =>
  await httpClient.get<LoginOtpSessionStatusResponse>(
    'auth/login/session-status',
    { _skipAuthRefresh: true }
  );

export const refresh = async () => await httpClient.post('auth/refresh-token');
