export const LOGIN_RESPONSE_CODE = {
  SIGNIN_SUCCESS: 'SIGNIN_SUCCESS',
  OTP_REQUIRED: 'OTP_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  ACCOUNT_BANNED: 'ACCOUNT_BANNED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
} as const;

export type LoginResponseCode =
  (typeof LOGIN_RESPONSE_CODE)[keyof typeof LOGIN_RESPONSE_CODE];

export interface LoginFeedbackState {
  code: LoginResponseCode;
}

interface BaseConfig {
  message: string;
}

interface PageConfig extends BaseConfig {
  type: 'page';
  replaceOnEntry: boolean;
  nextPath?: string;
}

interface NotificationConfig extends BaseConfig {
  type: 'error' | 'info' | 'success';
}

type CodeConfig = PageConfig | NotificationConfig;

export const LOGIN_CODE_CONFIG: Record<LoginResponseCode, CodeConfig> = {
  [LOGIN_RESPONSE_CODE.INVALID_CREDENTIALS]: {
    type: 'error',
    message: 'Invalid email or password. Please try again.',
  },
  [LOGIN_RESPONSE_CODE.EMAIL_NOT_VERIFIED]: {
    type: 'error',
    message:
      'Your email address has not been verified. Please check your inbox for an activation link.',
  },
  [LOGIN_RESPONSE_CODE.ACCOUNT_SUSPENDED]: {
    type: 'page',
    message:
      'Your account has been suspended. Please contact support for assistance.',
    replaceOnEntry: true,
    nextPath: '/auth/login/feedback',
  },
  [LOGIN_RESPONSE_CODE.ACCOUNT_BANNED]: {
    type: 'page',
    message:
      'Your account has been permanently banned. Please contact support.',
    replaceOnEntry: true,
    nextPath: '/auth/login/feedback',
  },
  [LOGIN_RESPONSE_CODE.ACCOUNT_LOCKED]: {
    type: 'page',
    message:
      'Your account has been temporarily locked due to excessive failed attempts. Please try again later.',
    replaceOnEntry: true,
    nextPath: '/auth/login/feedback',
  },
  [LOGIN_RESPONSE_CODE.SIGNIN_SUCCESS]: {
    type: 'success',
    message: 'Login successful! Redirecting...',
  },
  [LOGIN_RESPONSE_CODE.OTP_REQUIRED]: {
    type: 'page',
    message:
      'An OTP code has been sent to your registered email. Please verify it to continue.',
    replaceOnEntry: true,
    nextPath: '/auth/verify-otp',
  },
  [LOGIN_RESPONSE_CODE.TWO_FACTOR_REQUIRED]: {
    type: 'info',
    message:
      'Two-factor authentication is enabled. Verification process required.',
  },
} as const;
