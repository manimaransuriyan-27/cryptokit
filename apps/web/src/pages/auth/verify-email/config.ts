import { useAuthBroadcast } from '@/hooks/common/use-auth-broadcast';
import { VERIFY_EMAIL_RESPONSE_CODE } from '@/lib/response-codes';
import type {
  ErrorHandlersPayloadType,
  ResponseCodeHandlerMap,
  SuccessHandlersPayloadType,
} from '@/types/auth';
import type {
  VerifyEmailErrorKeys,
  VerifyEmailErrorFeedbackState,
  VerifyEmailSuccessFeedbackState
} from '@/types/auth';

type VerifyEmailSuccessResponses = {
  [VERIFY_EMAIL_RESPONSE_CODE.EMAIL_VERIFIED]: {
    code: typeof VERIFY_EMAIL_RESPONSE_CODE.EMAIL_VERIFIED;
  };
};

export type VerifyEmailErrorHandlersPayloadType =
  ErrorHandlersPayloadType<
    typeof VERIFY_EMAIL_RESPONSE_CODE,
    VerifyEmailErrorKeys
  >;

type VerifyEmailSuccessHandlers =
  SuccessHandlersPayloadType<VerifyEmailSuccessResponses>;

type VerifyEmailErrorHandlers =
  ResponseCodeHandlerMap<VerifyEmailErrorHandlersPayloadType>;

export const VERIFY_EMAIL_SUCCESS_HANDLERS: VerifyEmailSuccessHandlers =
{
  EMAIL_VERIFIED: (
    response,
    ctx
  ) => {
    useAuthBroadcast()?.emit({ event: 'EMAIL_VERIFIED' });
    ctx.navigate(
      `/auth/gz/register/complete-registration?code=${response.code}`,
      {
        replace: true,
        state: {
          code: response.code,
        } satisfies VerifyEmailSuccessFeedbackState,
      }
    );
  },
};

export const VERIFY_EMAIL_ERROR_HANDLERS: VerifyEmailErrorHandlers = {
  INVALID_VERIFICATION_LINK: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/verify-email/feedback?code=${_response.code}`,
      {
        replace: true,
        state: {
          code: _response.code,
        } satisfies VerifyEmailErrorFeedbackState,
      }
    );
  },
  LINK_ALREADY_USED: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/verify-email/feedback?code=${_response.code}`,
      {
        replace: true,
        state: {
          code: _response.code,
        } satisfies VerifyEmailErrorFeedbackState,
      }
    );
  },
  LINK_EXPIRED: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/verify-email/feedback?code=${_response.code}`,
      {
        replace: true,
        state: {
          code: _response.code,
        } satisfies VerifyEmailErrorFeedbackState,
      }
    );
  },
  REGISTRATION_ALREADY_COMPLETED: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/verify-email/feedback?code=${_response.code}`,
      {
        replace: true,
        state: {
          code: _response.code,
        } satisfies VerifyEmailErrorFeedbackState,
      }
    );
  },
  RESUME_REGISTRATION_COMPLETION: (_response, ctx) => {
    ctx.navigate(
      `/auth/gz/register/verify-email/feedback?code=${_response.code}`,
      {
        replace: true,
        state: {
          code: _response.code,
        } satisfies VerifyEmailErrorFeedbackState,
      }
    );
  },
  TOO_MANY_AUTH_REQUESTS: (_response, ctx) => {
    ctx.notification.error(
      'Too Many Requests',
      'Please wait a few minutes before requesting another verification email.'
    );

  }
};