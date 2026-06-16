import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { VERIFY_EMAIL_KEYS } from '@/lib/query-keys';
import { verifyEmailService } from '@/services/auth.service';
import type { VerifyEmailError, VerifyEmailCredentials } from '@/types/auth';

export const registerMutations = {
    verifyEmail: (
        options?: UseMutationOptions<
            Awaited<ReturnType<typeof verifyEmailService>>,
            VerifyEmailError,
            VerifyEmailCredentials
        >
    ) => {
        return useMutation({
            ...options,
            mutationKey: VERIFY_EMAIL_KEYS,
            mutationFn: verifyEmailService,
        });
    },
};
