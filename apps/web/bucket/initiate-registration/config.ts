// export const INITIATE_REGISTRATION_RESPONSE_CODE = {
//   EMAIL_IN_USE: 'EMAIL_IN_USE',
//   EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
//   REGISTRATION_RATE_LIMIT_EXCEEDED: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
//   TOO_MANY_REGISTRATION_REQUESTS: 'TOO_MANY_REGISTRATION_REQUESTS',
//   REGISTRATION_INITIATED: 'REGISTRATION_INITIATED',
// } as const;

import type { SuccessHandler } from "@/types/auth";

// export type InitiateRegistrationResponseCode =
//   (typeof INITIATE_REGISTRATION_RESPONSE_CODE)[keyof typeof INITIATE_REGISTRATION_RESPONSE_CODE];

// interface BaseConfig {
//   message?: string;
// }

// interface PageConfig extends BaseConfig {
//   type: 'page';
//   replaceOnEntry: boolean;
//   nextPath: string;
// }

// interface NotificationConfig extends BaseConfig {
//   type: 'error' | 'info' | 'success';
// }

// export type CodeConfig = PageConfig | NotificationConfig;

// export const INITIATE_REGISTRATION_RESPONSE_CONFIG: Record<
//   InitiateRegistrationResponseCode,
//   CodeConfig
// > = {
//   [INITIATE_REGISTRATION_RESPONSE_CODE.REGISTRATION_INITIATED]: {
//     type: 'page',
//     replaceOnEntry: true,
//     nextPath: `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.REGISTRATION_INITIATED}`,
//   },
//   [INITIATE_REGISTRATION_RESPONSE_CODE.EMAIL_ALREADY_VERIFIED]: {
//     type: 'page',
//     replaceOnEntry: true,
//     nextPath: `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.EMAIL_ALREADY_VERIFIED}`,
//   },
//   [INITIATE_REGISTRATION_RESPONSE_CODE.REGISTRATION_RATE_LIMIT_EXCEEDED]: {
//     type: 'error',
//     message: 'Registration rate limit exceeded. Please try again later.',
//   },
//   [INITIATE_REGISTRATION_RESPONSE_CODE.TOO_MANY_REGISTRATION_REQUESTS]: {
//     type: 'error',
//     message:
//       'Too many registration requests. Please try again after 5 minutes.',
//   },
//   [INITIATE_REGISTRATION_RESPONSE_CODE.EMAIL_IN_USE]: {
//     type: 'error',
//     message:
//       'An account with this email already exists. Please log in to continue.',
//   },
// } as const;



export type InitiateRegistrationHandlersPayloadType = {
  REGISTRATION_INITIATED: SuccessHandler<RegistrationInitiatedSuccessResponse>;
  EMAIL_ALREADY_VERIFIED: SuccessHandler<EmailAlreadyVerifiedSuccessResponse>;
};

export type InitiateRegistrationErrorHandlersPayloadType = ErrorHandlersPayloadType<
  typeof INITIATE_REGISTRATION_RESPONSE_CODE,
  InitiateRegistrationErrorKeys
>;

// --- REGISTRATION SUCCESS HANDLERS ---
export const INITIATE_REGISTRATION_SUCCESS_HANDLERS: InitiateRegistrationHandlersPayloadType = {
  REGISTRATION_INITIATED: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.REGISTRATION_INITIATED}`,
      { replace: true }
    );
  },

  EMAIL_ALREADY_VERIFIED: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.EMAIL_ALREADY_VERIFIED}`,
      { replace: true }
    );
  },
};

// --- REGISTRATION ERROR HANDLERS ---
export const INITIATE_REGISTRATION_ERROR_HANDLERS: ResponseCodeHandlerMap<InitiateRegistrationErrorHandlersPayloadType> = 
{
  EMAIL_IN_USE: (_response, ctx) => {
    ctx.notification.error(
      'Account Exists',
      'An account with this email already exists. Please log in to continue.'
    );
  },

  REGISTRATION_RATE_LIMIT_EXCEEDED: (_response, ctx) => {
    ctx.notification.error(
      'Rate Limit Exceeded',
      'Registration rate limit exceeded. Please try again later.'
    );
  },

  TOO_MANY_REGISTRATION_REQUESTS: (_response, ctx) => {
    ctx.notification.error(
      'Too Many Requests',
      'Too many registration requests. Please try again after 5 minutes.'
    );
  },
};