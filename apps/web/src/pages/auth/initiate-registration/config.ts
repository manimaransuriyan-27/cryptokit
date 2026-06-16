import { INITIATE_REGISTRATION_RESPONSE_CODE } from '@/lib/response-codes';
import { rootStore } from '@/stores/root.store';
import type {
  ErrorHandlersPayloadType,
  InitiateRegistrationErrorFeedbackState,
  InitiateRegistrationErrorKeys,
  InitiateRegistrationSuccessFeedbackState,
  InitiateRegistrationSuccessResponse,
  ResponseCodeHandlerMap,
  SuccessHandler
} from '@/types/auth';


export type InitiateRegistrationHandlersPayloadType = {
  REGISTRATION_INITIATED: SuccessHandler<
    InitiateRegistrationSuccessResponse
  >;
};

export type InitiateRegistrationErrorHandlersPayloadType = ErrorHandlersPayloadType<
  typeof INITIATE_REGISTRATION_RESPONSE_CODE,
  InitiateRegistrationErrorKeys
>;

export const INITIATE_REGISTRATION_SUCCESS_HANDLERS: InitiateRegistrationHandlersPayloadType = {
  REGISTRATION_INITIATED: (response, ctx) => {
    rootStore.authStore.setPreAuthEmail(response.data?.email);
    ctx.navigate(
      `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.REGISTRATION_INITIATED}`,
      {
        replace: true, state: {
          code: response.code
        } satisfies InitiateRegistrationSuccessFeedbackState
      }

    );
    return;
  },
};

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
  EMAIL_ALREADY_VERIFIED: (response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/initiate-registration/feedback?code=${INITIATE_REGISTRATION_RESPONSE_CODE.EMAIL_ALREADY_VERIFIED}`,
      {
        replace: true, state: {
          code: response.code
        } satisfies InitiateRegistrationErrorFeedbackState
      }
    );
  },
};