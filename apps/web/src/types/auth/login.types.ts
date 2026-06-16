import type {
  ErrorCodeValue,
  OnErrorValue,
  OnSuccessValue,
  SuccessCodeValue,
} from './common';

export type LoginErrorKeys =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_LOCKED';

export type LoginSuccessKeys = 'SIGNIN_SUCCESS' | 'OTP_REQUIRED';

export type LoginErrorCode = ErrorCodeValue<LoginErrorKeys>;
export type LoginSuccessCode = SuccessCodeValue<LoginSuccessKeys>;

export type LoginErrorResponse = OnErrorValue<LoginErrorCode>;
export type LoginSuccessResponse = OnSuccessValue<
  LoginSuccessCode,
  {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
>;

export type OtpRequiredSuccessResponse = OnSuccessValue<
  'OTP_REQUIRED',
  {
    requiresOtp: true;
    userId: string;
    code?: 'TWO_FACTOR_REQUIRED';
    statusCode?: number;
  }
>;

export type LoginResponse = LoginSuccessResponse;

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

// ----------------

export type LoginOtpErrorKeys =
  | 'TOO_MANY_AUTH_REQUESTS'
  | 'INVALID_OTP'
  | 'USER_NOT_FOUND'
  | 'OTP_EXPIRED'
  | 'ACCOUNT_BANNED'
  | 'ACCOUNT_SUSPENDED'
  | 'USER_NOT_FOUND';

export type LoginOtpSuccessKeys = 'OTP_VERIFIED';

export type LoginOtpErrorCode = ErrorCodeValue<LoginOtpErrorKeys>;
export type LoginOtpSuccessCode = SuccessCodeValue<LoginOtpSuccessKeys>;

export type LoginOtpErrorResponse = OnErrorValue<LoginOtpErrorCode>;
export type LoginOtpSuccessResponse = OnSuccessValue<
  LoginOtpSuccessCode,
  {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
>;

export type LoginOtpResponse = LoginOtpSuccessResponse;

export interface LoginOtpCredentials {
  otp: string;
}

export interface LoginOtpErrorFeedbackState {
  code: LoginOtpErrorCode;
}

export interface LoginOtpSuccessFeedbackState {
  code: LoginOtpSuccessCode;
}

// -------------

export type LoginOtpSessionStatusErrorKeys = 'INVALID_OTP_SESSION';
export type LoginOtpSessionStatusSuccessKeys = 'OTP_SESSION_VALID';

export type LoginOtpSessionStatusErrorCode =
  ErrorCodeValue<LoginOtpSessionStatusErrorKeys>;
export type LoginOtpSessionStatusSuccessCode =
  SuccessCodeValue<LoginOtpSessionStatusSuccessKeys>;

export type LoginOtpSessionStatusErrorResponse =
  OnErrorValue<LoginOtpSessionStatusErrorCode>;
export type LoginOtpSessionStatusSuccessResponse = OnSuccessValue<
  LoginOtpSessionStatusSuccessCode,
  {
    email: string;
  }
>;

export type LoginOtpSessionStatusResponse =
  LoginOtpSessionStatusSuccessResponse;

// --------------

export type ResendLoginOtpErrorKeys =
  | 'INVALID_OTP_SESSION'
  | 'USER_NOT_FOUND'
  | 'TWO_FACTOR_NOT_ENABLED'
  | 'OTP_RATE_LIMIT_EXCEEDED';
export type ResendLoginOtpSuccessKeys = 'OTP_RESENT';

export type ResendLoginOtpErrorCode = ErrorCodeValue<ResendLoginOtpErrorKeys>;
export type ResendLoginOtpSuccessCode =
  SuccessCodeValue<ResendLoginOtpSuccessKeys>;

export type ResendLoginOtpErrorResponse = OnErrorValue<ResendLoginOtpErrorCode>;
export type ResendLoginOtpSuccessResponse =
  OnSuccessValue<ResendLoginOtpSuccessCode>;

export type ResendLoginOtpResponse = ResendLoginOtpSuccessResponse;

// -------------

export type LogoutErrorKeys = 'INVALID_SESSION_ID' | 'UNAUTHORIZED';
export type LogoutSuccessKeys = 'LOGOUT_SUCCESS';

export type LogoutErrorCode = ErrorCodeValue<LogoutErrorKeys>;
export type LogoutSuccessCode = SuccessCodeValue<LogoutSuccessKeys>;

export type LogoutErrorResponse = OnErrorValue<LogoutErrorCode>;
export type LogoutSuccessResponse = OnSuccessValue<LogoutSuccessCode>;

export type LogoutResponse = LogoutSuccessResponse;