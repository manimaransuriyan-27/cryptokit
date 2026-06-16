import { SESSION_QUERY_KEYS } from '@/lib/query-keys';
import { LOGIN_RESPONSE_CODE } from '@/lib/response-codes';
import { getMeService } from '@/services/auth.service';
import { rootStore } from '@/stores/root.store';
import type {
  ErrorHandlersPayloadType,
  LoginSuccessResponse,
  OtpRequiredSuccessResponse,
  ResponseCodeHandlerMap,
  SuccessHandlersPayloadType,
} from '@/types/auth';
import type {
  LoginErrorFeedbackState,
  LoginErrorKeys,
} from '@/types/auth/login.types';

type LoginSuccessResponses = {
  [LOGIN_RESPONSE_CODE.SIGNIN_SUCCESS]: LoginSuccessResponse;
  [LOGIN_RESPONSE_CODE.OTP_REQUIRED]: OtpRequiredSuccessResponse;
};

export type LoginErrorHandlersPayloadType = ErrorHandlersPayloadType<
  typeof LOGIN_RESPONSE_CODE,
  LoginErrorKeys
>;

type LoginSuccessHandlers = SuccessHandlersPayloadType<LoginSuccessResponses>;
type LoginErrorHandlers = ResponseCodeHandlerMap<LoginErrorHandlersPayloadType>;

export const LOGIN_SUCCESS_HANDLERS: LoginSuccessHandlers = {
  SIGNIN_SUCCESS: async (_response, ctx) => {
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

  [LOGIN_RESPONSE_CODE.OTP_REQUIRED]: (response, ctx) => {
    const authStore = rootStore.authStore;
    ctx.queryClient.removeQueries({ queryKey: SESSION_QUERY_KEYS });
    authStore.setPendingOtpUserId(response.data.userId);
    ctx.navigate(
      `/auth/login/verify-otp?redirectTo=${encodeURIComponent(ctx.redirectTo)}`,
      { replace: true }
    );
  },
};

export const LOGIN_ERROR_HANDLERS: LoginErrorHandlers = {
  [LOGIN_RESPONSE_CODE.INVALID_CREDENTIALS]: (_response, ctx) => {
    ctx.notification.error(
      'Error',
      'Invalid email or password. Please try again.'
    );
  },

  [LOGIN_RESPONSE_CODE.EMAIL_NOT_VERIFIED]: (response, ctx) => {
    ctx.navigate('/auth/login/feedback', {
      replace: true,
      state: { code: response.code } satisfies LoginErrorFeedbackState,
    });
  },

  [LOGIN_RESPONSE_CODE.ACCOUNT_SUSPENDED]: (response, ctx) => {
    ctx.navigate('/auth/login/feedback', {
      replace: true,
      state: { code: response.code } satisfies LoginErrorFeedbackState,
    });
  },

  [LOGIN_RESPONSE_CODE.ACCOUNT_BANNED]: (response, ctx) => {
    ctx.navigate('/auth/login/feedback', {
      replace: true,
      state: { code: response.code } satisfies LoginErrorFeedbackState,
    });
  },

  [LOGIN_RESPONSE_CODE.ACCOUNT_LOCKED]: (response, ctx) => {
    ctx.navigate('/auth/login/feedback', {
      replace: true,
      state: { code: response.code } satisfies LoginErrorFeedbackState,
    });
  },
};
