import { useAppNotification } from '@/hooks/common/use-notifications';
import { authMutations } from '@/hooks/mutations/auth';
import { useTypedNavigate } from '@/hooks/typed-hooks';
import type {
    HandlerContext,
    LoginOtpErrorResponse,
    LoginOtpSuccessResponse,
    ResendLoginOtpErrorResponse,
    ResendLoginOtpSuccessResponse,
    ResponseHandler,
} from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
    LOGIN_OTP_ERROR_HANDLERS,
    LOGIN_OTP_HANDLERS,
    RESEND_LOGIN_OTP_ERROR_HANDLERS,
    RESEND_LOGIN_OTP_SUCCESS_HANDLERS,
    type LoginOtpErrorHandlersPayloadType,
    type ResendLoginOtpErrorHandlersPayloadType,
} from './config';

export const loginOtpInteractor = () => {
    const queryClient = useQueryClient();
    const navigate = useTypedNavigate();
    const notification = useAppNotification();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') ?? '/sz/dashboard';

    const ctx: HandlerContext = {
        queryClient,
        navigate,
        notification,
        redirectTo,
    };

    const handleLoginOtpSuccess = (response: LoginOtpSuccessResponse) => {
        const handler = LOGIN_OTP_HANDLERS[response.code] as ResponseHandler<
            typeof response
        >;
        return handler(response, ctx);
    };

    const handleLoginOtpError = (error: LoginOtpErrorResponse) => {
        const code = error?.response?.data?.code as
            | LoginOtpErrorHandlersPayloadType['code']
            | undefined;

        if (!code || !(code in LOGIN_OTP_ERROR_HANDLERS)) {
            notification.error('Unexpected Error', 'Something went wrong.');
            return;
        }

        const payload = { code } as LoginOtpErrorHandlersPayloadType;
        const handler = LOGIN_OTP_ERROR_HANDLERS[code] as ResponseHandler<
            typeof payload
        >;
        return handler(payload, ctx);
    };

    const resendLoginOtpSuccess = (response: ResendLoginOtpSuccessResponse) => {
        const handler = RESEND_LOGIN_OTP_SUCCESS_HANDLERS[response.code] as ResponseHandler<
            typeof response
        >;
        return handler(response, ctx);
    };

    const resendLoginOtpError = (error: ResendLoginOtpErrorResponse) => {
        const code = error?.response?.data?.code as
            | ResendLoginOtpErrorHandlersPayloadType['code']
            | undefined;

        if (!code || !(code in RESEND_LOGIN_OTP_ERROR_HANDLERS)) {
            notification.error('Unexpected Error', 'Something went wrong.');
            return;
        }

        const payload = { code } as ResendLoginOtpErrorHandlersPayloadType;
        const handler = RESEND_LOGIN_OTP_ERROR_HANDLERS[code] as ResponseHandler<
            typeof payload
        >;
        return handler(payload, ctx);
    };

    const loginOtpMutation = authMutations.loginOtp({
        onSuccess: handleLoginOtpSuccess,
        onError: handleLoginOtpError,
    });

    const resendLoginOtpMutation = authMutations.resendLoginOtp({
        onSuccess: resendLoginOtpSuccess,
        onError: resendLoginOtpError,
    });

    const onLoginOtp = (credentials: { otp: string }) => {
        loginOtpMutation.mutate({
            otp: credentials.otp,
        });
    };

    return {
        onLoginOtp: onLoginOtp,
        resendLoginOtp: resendLoginOtpMutation.mutate,
        isSubmitting: loginOtpMutation.isPending,
        isResending: resendLoginOtpMutation.isPending,
        contextHolder: notification.notificationContextHolder,
    };
};
