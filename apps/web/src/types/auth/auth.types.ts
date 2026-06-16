import { SUCCESS_CODES } from '@repo/utils';
import type {
  ErrorCodeValue,
  OnErrorValue,
  OnSuccessValue,
  SuccessCodeValue,
} from './common';
import type { UserRole, UserStatus } from '../enum';

// ============================================================================
// Core Entities & Shared Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  kycVerified: boolean;
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Authentication: Primary Login Flow

type LoginErrorKeys =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_LOCKED';

type LoginSuccessKeys = 'SIGNIN_SUCCESS';

export type LoginErrorCode = ErrorCodeValue<LoginErrorKeys>;
export type LoginSuccessCode = SuccessCodeValue<LoginSuccessKeys>;

export type LoginErrorResponse = OnErrorValue<LoginErrorCode>;
export type LoginSuccessResponse = OnSuccessValue<
  LoginSuccessCode,
  {
    tokens: AuthTokens;
  }
>;

export type OtpRequiredSuccessResponse = OnSuccessValue<
  'OTP_REQUIRED',
  {
    requiresOtp: true;
    userId: string;
    code?: typeof SUCCESS_CODES.TWO_FACTOR_REQUIRED;
    statusCode?: number;
  }
>;

export type LoginApiResponse =
  | LoginSuccessResponse
  | OtpRequiredSuccessResponse;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginErrorFeedbackState {
  code: LoginErrorCode;
}

export interface LoginSuccessFeedbackState {
  code: LoginSuccessCode;
}

// Authentication: OTP Verification Flow

type LoginOtpErrorKeys = 'INVALID_OTP' | 'USER_NOT_FOUND' | 'OTP_EXPIRED';

export type LoginOtpErrorCode = ErrorCodeValue<LoginOtpErrorKeys>;
export type LoginOtpSuccessCode = SuccessCodeValue<'OTP_VERIFIED'>;

export type LoginOtpError = OnErrorValue<LoginOtpErrorCode>;
export type LoginOtpSuccess = OnSuccessValue<
  LoginOtpSuccessCode,
  {
    tokens: AuthTokens;
  }
>;

export type LoginOtpApiResponse = LoginOtpSuccess;

export interface LoginOtpCredentials {
  userId: string;
  otp: string;
}

export interface LoginOtpErrorFeedbackState {}

export interface LoginOtpSuccessFeedbackState {}

// Authentication: Resend OTP Flow

type ResendLoginOtpErrorKeys = 'OTP_RATE_LIMIT_EXCEEDED' | 'USER_NOT_FOUND';

export type ResendLoginOtpErrorCode = ErrorCodeValue<ResendLoginOtpErrorKeys>;
export type ResendLoginOtpSuccessCode = SuccessCodeValue<'OTP_SENT'>;

export type ResendLoginOtpError = OnErrorValue<ResendLoginOtpErrorCode>;
export type ResendLoginOtpSuccess = OnSuccessValue<ResendLoginOtpSuccessCode>;

export type ResendLoginOtpApiResponse = ResendLoginOtpSuccess;

export interface ResendLoginOtpCredentials {
  userId: string;
}

// Registration: Phase 1 (Initiate)

type InitiateRegistrationErrorKeys =
  | 'EMAIL_IN_USE'
  | 'REGISTRATION_RATE_LIMIT_EXCEEDED'
  | 'TOO_MANY_REGISTRATION_REQUESTS'
  | 'EMAIL_ALREADY_VERIFIED';

type InitiateRegistrationSuccessKeys = 'REGISTRATION_INITIATED';

export type InitiateRegistrationErrorCode =
  ErrorCodeValue<InitiateRegistrationErrorKeys>;
export type InitiateRegistrationSuccessCode =
  SuccessCodeValue<InitiateRegistrationSuccessKeys>;

export type InitiateRegistrationError =
  OnErrorValue<InitiateRegistrationErrorCode>;
export type InitiateRegistrationSuccess = OnSuccessValue<
  InitiateRegistrationSuccessCode,
  { email: string }
>;

export type InitiateRegistrationApiResponse = InitiateRegistrationSuccess;

export interface InitiateRegistrationCredentials {
  email: string;
}

export interface InitiateRegistrationErrorFeedbackState {
  code: InitiateRegistrationErrorKeys;
}

export interface InitiateRegistrationSuccessFeedbackState {
  code: InitiateRegistrationSuccessKeys;
  data?: {
    emailId: string;
  };
}

// Registration: Phase 2 (Email Verification Link)

type VerifyRegisterEmailErrorKeys =
  | 'LINK_ALREADY_USED'
  | 'INVALID_VERIFICATION_LINK'
  | 'RESUME_REGISTRATION_COMPLETION'
  | 'TOO_MANY_AUTH_REQUESTS'
  | 'REGISTRATION_ALREADY_COMPLETED'
  | 'LINK_EXPIRED';

type VerifyRegisterEmailSuccessKeys = 'EMAIL_VERIFIED';

export type VerifyRegisterEmailErrorCode =
  ErrorCodeValue<VerifyRegisterEmailErrorKeys>;
export type VerifyRegisterEmailSuccessCode =
  SuccessCodeValue<VerifyRegisterEmailSuccessKeys>;

export type VerifyRegisterEmailError =
  OnErrorValue<VerifyRegisterEmailErrorCode>;
export type VerifyRegisterEmailSuccess = OnSuccessValue<
  VerifyRegisterEmailSuccessCode,
  {
    completionToken: string;
  }
>;

export interface VerifyRegisterEmailCredentials {
  token: string;
}

export interface VerifyRegisterEmailErrorFeedbackState {
  code: VerifyRegisterEmailErrorKeys;
  data?: {
    emailId: string;
  };
}
export interface VerifyRegisterEmailSuccessFeedbackState {
  code: VerifyRegisterEmailSuccessKeys;
}

export type VerifyRegisterEmailApiResponse = VerifyRegisterEmailSuccess;

// ============================================================================
// Registration: Phase 3 (Profile Completion)
// ============================================================================

type CompleteRegistrationErrorKeys =
  | 'LINK_EXPIRED'
  | 'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN'
  | 'PHONE_ALREADY_IN_USE'
  | 'REGISTRATION_ALREADY_COMPLETED'
  | 'USER_NOT_FOUND';

type CompleteRegistrationSuccessKeys = 'REGISTRATION_COMPLETED';

export type CompleteRegistrationErrorCode =
  ErrorCodeValue<CompleteRegistrationErrorKeys>;
export type CompleteRegistrationSuccessCode =
  SuccessCodeValue<CompleteRegistrationSuccessKeys>;

export type CompleteRegistrationError =
  OnErrorValue<CompleteRegistrationErrorCode>;
export type CompleteRegistrationSuccess =
  OnSuccessValue<CompleteRegistrationSuccessCode>;

export interface CompleteRegistrationCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type CompleteRegistrationApiResponse = CompleteRegistrationSuccess;

export type CompleteRegistrationErrorFeedbackState = {
  code: CompleteRegistrationErrorKeys;
};

export type CompleteRegistrationSuccessFeedbackState = {
  code: CompleteRegistrationSuccessKeys;
};

export type ResumeCompletionOfRegistrationErrorKeys =
  | 'USER_NOT_FOUND'
  | 'TOO_MANY_AUTH_REQUESTS';

export type ResumeCompletionOfRegistrationSuccessKeys =
  'GET_COMPLETION_REGISTRATION_TOKEN';

export type ResumeCompletionOfRegistrationErrorCode =
  ErrorCodeValue<ResumeCompletionOfRegistrationErrorKeys>;
export type ResumeCompletionOfRegistrationSuccessCode =
  SuccessCodeValue<ResumeCompletionOfRegistrationSuccessKeys>;

export type ResumeCompletionOfRegistrationError =
  OnErrorValue<ResumeCompletionOfRegistrationErrorCode>;

export type ResumeCompletionOfRegistrationSuccess = OnSuccessValue<
  ResumeCompletionOfRegistrationSuccessCode,
  {
    completionToken: string;
  }
>;

export interface ResumeCompletionOfRegistrationCredentials {
  email: string;
}

export type ResumeCompletionOfRegistrationApiResponse =
  ResumeCompletionOfRegistrationSuccess;

export interface ResumeCompletionOfRegistrationSuccessFeedbackState {
  code: ResumeCompletionOfRegistrationSuccessKeys;
}

export interface ResumeCompletionOfRegistrationErrorFeedbackState {
  code: ResumeCompletionOfRegistrationErrorKeys;
}

export type GetCompletionStatusErrorKeys =
  | 'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN'
  | 'REGISTRATION_ALREADY_COMPLETED'
  | 'LINK_EXPIRED';

export type GetCompletionStatusSuccessKeys = 'COMPLETION_STATUS_VALID';

export type GetCompletionStatusErrorCode =
  ErrorCodeValue<GetCompletionStatusErrorKeys>;
export type GetCompletionStatusSuccessCode =
  SuccessCodeValue<GetCompletionStatusSuccessKeys>;

export type GetCompletionStatusError =
  OnErrorValue<GetCompletionStatusErrorCode>;

export type GetCompletionStatusSuccess =
  OnSuccessValue<GetCompletionStatusSuccessCode>;

export type GetCompletionStatusErrorFeedbackState = {
  code: GetCompletionStatusErrorKeys;
};

export type GetCompletionStatusSuccessFeedbackState = {
  code: GetCompletionStatusSuccessKeys;
};

export type GetCompletionStatusApiResponse = GetCompletionStatusSuccess;
