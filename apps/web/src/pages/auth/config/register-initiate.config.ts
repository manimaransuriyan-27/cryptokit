export const REGISTER_INITIATE_RESPONSE_CODE = {
  REGISTRATION_INITIATED: 'REGISTRATION_INITIATED',
  REGISTRATION_NOT_INITIATED: 'REGISTRATION_NOT_INITIATED',
  VERIFICATION_EMAIL_SENT: 'VERIFICATION_EMAIL_SENT',
  TOO_MANY_RESEND_REQUESTS: 'TOO_MANY_RESEND_REQUESTS',
  EMAIL_IN_USE: 'EMAIL_IN_USE',
  REGISTRATION_RATE_LIMIT_EXCEEDED: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
  TOO_MANY_REGISTRATION_REQUESTS: 'TOO_MANY_REGISTRATION_REQUESTS',
} as const;

export type RegisterInitiateResponseCode =
  (typeof REGISTER_INITIATE_RESPONSE_CODE)[keyof typeof REGISTER_INITIATE_RESPONSE_CODE];

export interface RegisterInitiateFeedbackState {
  code: RegisterInitiateResponseCode;
}

interface BaseConfig {
  message: string;
}

interface PageConfig extends BaseConfig {
  type: 'page';
  replaceOnEntry: boolean;
  nextPath: string;
}

interface NotificationConfig extends BaseConfig {
  type: 'error' | 'info' | 'success';
}

type CodeConfig = PageConfig | NotificationConfig;

export const REGISTER_INITIATE_CODE_CONFIG: Record<
  RegisterInitiateResponseCode,
  CodeConfig
> = {
  REGISTRATION_INITIATED: {
    type: 'page',
    message: 'A verification link has been sent to your email address.',
    replaceOnEntry: true,
    nextPath: '/auth/register/feedback',
  },
  INVALID_VERIFICATION_LINK: {
    type: 'page',
    message: 'This verification link is invalid or has expired.',
    replaceOnEntry: true,
    nextPath: '/auth/access-denied',
  },
  LINK_ALREADY_USED: {
    type: 'page',
    message: 'This verification link has already been used.',
    replaceOnEntry: false,
    nextPath: '/auth/access-denied',
  },
  REGISTRATION_NOT_INITIATED: {
    type: 'page',
    message: 'No registration request was found for this verification link.',
    replaceOnEntry: false,
    nextPath: '/auth/access-denied',
  },
  EMAIL_ALREADY_VERIFIED: {
    type: 'info',
    message: 'Your email address has already been verified.',
  },
  REGISTRATION_ALREADY_COMPLETED: {
    type: 'info',
    message: 'Your account has already been created. Please sign in.',
  },
  VERIFICATION_EMAIL_SENT: {
    type: 'success',
    message: 'A new verification email has been sent successfully.',
  },
  TOO_MANY_RESEND_REQUESTS: {
    type: 'error',
    message: 'Too many verification email requests. Please try again later.',
  },
  EMAIL_IN_USE: {
    type: 'error',
    message: 'An account already exists with this email address.',
  },
  PHONE_ALREADY_IN_USE: {
    type: 'error',
    message: 'This phone number is already associated with another account.',
  },
  REGISTRATION_RATE_LIMIT_EXCEEDED: {
    type: 'error',
    message:
      'A verification email was recently sent. Please wait before trying again.',
  },
  TOO_MANY_REGISTRATION_REQUESTS: {
    type: 'error',
    message: 'Too many registration attempts. Please try again later.',
  },
};
