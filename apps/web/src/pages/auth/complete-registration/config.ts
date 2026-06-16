export const COMPLETE_REGISTRATION_RESPONSE_CODE = {
  LINK_EXPIRED: 'LINK_EXPIRED',
  INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN:
    'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN',
  PHONE_ALREADY_IN_USE: 'PHONE_ALREADY_IN_USE',
  REGISTRATION_ALREADY_COMPLETED: 'REGISTRATION_ALREADY_COMPLETED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  REGISTRATION_COMPLETED: 'REGISTRATION_COMPLETED', // success: redirect to account created
} as const;

export type CompleteRegistrationResponseCode =
  (typeof COMPLETE_REGISTRATION_RESPONSE_CODE)[keyof typeof COMPLETE_REGISTRATION_RESPONSE_CODE];

interface BaseConfig {
  message?: string;
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

export const COMPLETE_REGISTRATION_CODE_CONFIG: Record<
  CompleteRegistrationResponseCode,
  CodeConfig
> = {
  [COMPLETE_REGISTRATION_RESPONSE_CODE.LINK_EXPIRED]: {
    type: 'page',
    message:
      'This registration link has expired. Please request a new verification link to continue.',
    replaceOnEntry: true,
    nextPath: `/auth/register/complete-registration/feedback?code=${COMPLETE_REGISTRATION_RESPONSE_CODE.LINK_EXPIRED}`,
  },

  [COMPLETE_REGISTRATION_RESPONSE_CODE.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN]:
    {
      type: 'page',
      message:
        'This registration link has expired. Please request a new verification link to continue.',
      replaceOnEntry: true,
      nextPath: `/auth/register/complete-registration/feedback?code=${COMPLETE_REGISTRATION_RESPONSE_CODE.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN}`,
    },
  [COMPLETE_REGISTRATION_RESPONSE_CODE.PHONE_ALREADY_IN_USE]: {
    type: 'error',
    message: 'Phone number already in use. Please try again.',
  },
  [COMPLETE_REGISTRATION_RESPONSE_CODE.REGISTRATION_ALREADY_COMPLETED]: {
    type: 'page',
    message: 'Registration already completed. Please sign in to continue.',
    replaceOnEntry: true,
    nextPath: `/auth/register/complete-registration/feedback?code=${COMPLETE_REGISTRATION_RESPONSE_CODE.REGISTRATION_ALREADY_COMPLETED}`,
  },
  [COMPLETE_REGISTRATION_RESPONSE_CODE.USER_NOT_FOUND]: {
    type: 'page',
    message: 'User not found. Please try again.',
    replaceOnEntry: true,
    nextPath: `/auth/register/complete-registration/feedback?code=${COMPLETE_REGISTRATION_RESPONSE_CODE.USER_NOT_FOUND}`,
  },
  [COMPLETE_REGISTRATION_RESPONSE_CODE.REGISTRATION_COMPLETED]: {
    type: 'page',
    message: 'Registration completed successfully. Please sign in to continue.',
    replaceOnEntry: true,
    nextPath: `/auth/register/complete-registration/feedback?code=${COMPLETE_REGISTRATION_RESPONSE_CODE.REGISTRATION_COMPLETED}`,
  },
} as const;
