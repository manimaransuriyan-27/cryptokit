import { SESSION_QUERY_KEYS } from '@/lib/query-keys';
import { LOGIN_OTP_RESPONSE_CODE } from '@/lib/response-codes';
import { getMeService } from '@/services/auth.service';
import { rootStore } from '@/stores/root.store';
import type { LoginOtpErrorFeedbackState } from '@/types';
import type {
  ErrorHandlersPayloadType,
  LoginOtpErrorKeys,
  LoginOtpSuccessResponse,
  ResponseCodeHandlerMap,
  SuccessHandler,
} from '@/types/auth';

export type LoginOtpHandlersPayloadType = {
  OTP_VERIFIED: SuccessHandler<LoginOtpSuccessResponse>;
};

export type LoginOtpErrorHandlersPayloadType = ErrorHandlersPayloadType<
  typeof LOGIN_OTP_RESPONSE_CODE,
  LoginOtpErrorKeys
>;

export const LOGIN_OTP_HANDLERS: LoginOtpHandlersPayloadType = {
  OTP_VERIFIED: async (_response, ctx) => {
    const authStore = rootStore.authStore;
    authStore.setIsLoading(true);
    try {
      await ctx.queryClient.fetchQuery({
        queryKey: SESSION_QUERY_KEYS,
        queryFn: getMeService,
        staleTime: 0,
      });
      ctx.navigate(ctx.redirectTo, { replace: true });
    } catch {
      ctx.notification.error(
        'Session Error',
        'Login succeeded but we could not load your profile. Please try again.'
      );
      ctx.navigate('/auth/login', { replace: true });
    } finally {
      authStore.setIsLoading(false);
    }
  },
};

export const LOGIN_OTP_ERROR_HANDLERS: ResponseCodeHandlerMap<LoginOtpErrorHandlersPayloadType> =
  {
    ACCOUNT_BANNED: (response, ctx) => {
      ctx.navigate('/auth/login/feedback', {
        replace: true,
        state: { code: response.code } satisfies LoginOtpErrorFeedbackState,
      });
    },
    ACCOUNT_SUSPENDED: (response, ctx) => {
      ctx.navigate('/auth/login/feedback', {
        replace: true,
        state: { code: response.code } satisfies LoginOtpErrorFeedbackState,
      });
    },
    INVALID_OTP: (_response, ctx) => {
      ctx.notification.error(
        'Error',
        'The verification code is incorrect. Please check and try again.'
      );
    },
    OTP_EXPIRED: (_response, ctx) => {
      ctx.notification.error(
        'Error',
        'Your verification code has expired. Please request a new code.'
      );
    },
    TOO_MANY_AUTH_REQUESTS: (_response, ctx) => {
      ctx.notification.error(
        'Error',
        'Too many OTP requests. Please wait a few minutes before trying again.'
      );
    },
    USER_NOT_FOUND: (_response, ctx) => {
      ctx.navigate('auth/login', { replace: true });
    },
  };
