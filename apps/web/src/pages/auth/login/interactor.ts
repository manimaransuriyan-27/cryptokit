import { useAppNotification } from '@/hooks/common/use-notifications';
import { authMutations } from '@/hooks/mutations/auth';
import { useTypedNavigate } from '@/hooks/typed-hooks';
import { rootStore } from '@/stores/root.store';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
    LOGIN_ERROR_HANDLERS,
    LOGIN_SUCCESS_HANDLERS,
    type LoginErrorHandlersPayloadType,
} from './config';

import type {
    HandlerContext,
    LoginErrorResponse,
    LoginSuccessResponse,
    OtpRequiredSuccessResponse,
    ResponseHandler,
} from '@/types/auth';

export const loginInteractor = () => {
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

    const handleLoginSuccess = (
        response: LoginSuccessResponse | OtpRequiredSuccessResponse
    ) => {
        const handler = LOGIN_SUCCESS_HANDLERS[response.code] as ResponseHandler<
            typeof response
        >;
        return handler(response, ctx);
    };


    const handleLoginError = (error: LoginErrorResponse) => {
        const code = error?.response?.data?.code
        if (!code || !(code in LOGIN_ERROR_HANDLERS)) {
            notification.error('Unexpected Error', 'Something went wrong.');
            return;
        }

        const payload = { code } as LoginErrorHandlersPayloadType;
        const handler = LOGIN_ERROR_HANDLERS[code] as ResponseHandler<
            typeof payload
        >;
        return handler(payload, ctx);
    };

    const loginMutation = authMutations.login({
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
    });

    return {
        onLogin: loginMutation.mutate,
        isSubmitting: loginMutation.isPending || rootStore.authStore.isLoading,
        contextHolder: notification.notificationContextHolder,
    };
};
