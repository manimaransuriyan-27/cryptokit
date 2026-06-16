import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { getQueryClient } from '@/lib/query-client';
import { LOGIN_OTP_SESSION_STATUS_QUERY_KEYS } from '@/lib/query-keys';
import { getLoginOtpSessionStatusService } from '@/services/auth.service';

export const verifyLoginOtpLoader = async ({ request }: LoaderFunctionArgs) => {
    const queryClient = getQueryClient();
    try {
        await queryClient.fetchQuery({
            queryKey: LOGIN_OTP_SESSION_STATUS_QUERY_KEYS,
            queryFn: getLoginOtpSessionStatusService,
            staleTime: 0,
        });
        return null;
    } catch {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get('redirectTo');
        const loginUrl = redirectTo
            ? `/auth/gz/login?redirectTo=${encodeURIComponent(redirectTo)}`
            : '/auth/gz/login';
        return redirect(loginUrl);
    }
};
