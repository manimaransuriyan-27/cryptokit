import type { useAppNotification } from '@/hooks/common/use-notifications';
import { ERROR_CODES, SUCCESS_CODES } from '@repo/utils';
import type { QueryClient } from '@tanstack/react-query';

export type ErrorCodeValue<TCODE extends keyof typeof ERROR_CODES> =
  (typeof ERROR_CODES)[TCODE];

export type SuccessCodeValue<TCODE extends keyof typeof SUCCESS_CODES> =
  (typeof SUCCESS_CODES)[TCODE];

export interface OnErrorValue<TCODE = typeof ERROR_CODES> {
  response?: {
    data?: {
      success: false;
      code: TCODE;
      message: string;
    };
    message?: string;
  };
}

export interface OnSuccessValue<TCODE = typeof SUCCESS_CODES, TDATA = {}> {
  success: true;
  code: TCODE;
  message: string;
  data: TDATA;
}

export type SuccessHandlersPayloadType<T extends Record<string, unknown>> = {
  [K in keyof T]: SuccessHandler<T[K]>;
};

export type ErrorHandlersPayloadType<
  TConfig extends Record<string, string>,
  TKeys extends keyof TConfig,
> = {
  [K in TKeys]: {
    code: TConfig[K];
  };
}[TKeys];

export interface HandlerContext {
  queryClient: QueryClient;
  navigate: (
    path: string,
    opts?: { replace?: boolean; state?: unknown }
  ) => void;
  notification: ReturnType<typeof useAppNotification>;
  onClick?: () => void;
  redirectTo: string;
}

export type SuccessHandler<TResponse> = (
  response: TResponse,
  ctx: HandlerContext
) => Promise<void> | void;

export type ResponseCodeHandlerMap<TResponse extends { code: string }> = {
  [K in TResponse['code']]: ResponseHandler<Extract<TResponse, { code: K }>>;
};

export type ResponseHandler<TResponse> = (
  response: TResponse,
  ctx: HandlerContext
) => Promise<void> | void;
