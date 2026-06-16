export const VERIFY_REGISTER_EMAIL_RESPONSE_CODE = {
  INVALID_VERIFICATION_LINK: 'INVALID_VERIFICATION_LINK',
  LINK_ALREADY_USED: 'LINK_ALREADY_USED',
  TOO_MANY_AUTH_REQUESTS: 'TOO_MANY_AUTH_REQUESTS',
  RESUME_REGISTRATION_COMPLETION: 'RESUME_REGISTRATION_COMPLETION',
  REGISTRATION_ALREADY_COMPLETED: 'REGISTRATION_ALREADY_COMPLETED',
  LINK_EXPIRED: 'LINK_EXPIRED',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
} as const;

export type VerifyRegisterEmailResponseCode =
  (typeof VERIFY_REGISTER_EMAIL_RESPONSE_CODE)[keyof typeof VERIFY_REGISTER_EMAIL_RESPONSE_CODE];

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

export const VERIFY_REGISTER_EMAIL_CODE_CONFIG: Record<
  VerifyRegisterEmailResponseCode,
  CodeConfig
> = {
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.INVALID_VERIFICATION_LINK]: {
    type: 'page',
    message:
      'This verification link is invalid or has expired. Please request a new verification email.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.INVALID_VERIFICATION_LINK}`,
  },

  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.LINK_ALREADY_USED]: {
    type: 'page',
    message:
      'Your email address has already been verified. Please sign in to continue.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.LINK_ALREADY_USED}`,
  },
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.TOO_MANY_AUTH_REQUESTS]: {
    type: 'page',
    message:
      'Too many authentication attempts. Please try again after 15 minutes.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.TOO_MANY_AUTH_REQUESTS}`,
  },
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.RESUME_REGISTRATION_COMPLETION]: {
    type: 'page',
    message:
      'Your email address has already been verified. Please complete your profile to finish registration.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.RESUME_REGISTRATION_COMPLETION}`,
  },
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.REGISTRATION_ALREADY_COMPLETED]: {
    type: 'page',
    message:
      'Your registration has already been completed. Please sign in to continue.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.REGISTRATION_ALREADY_COMPLETED}`,
  },
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.LINK_EXPIRED]: {
    type: 'page',
    message:
      'This verification link has already expired. Please request a new verification email.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/verify-register-email/feedback?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.LINK_EXPIRED}`,
  },
  [VERIFY_REGISTER_EMAIL_RESPONSE_CODE.EMAIL_VERIFIED]: {
    type: 'page',
    message:
      'Email verified successfully. Please complete your profile to finish registration.',
    replaceOnEntry: true,
    nextPath: `/auth/gz/register/complete-registration?code=${VERIFY_REGISTER_EMAIL_RESPONSE_CODE.EMAIL_VERIFIED}`,
  },
} as const;
