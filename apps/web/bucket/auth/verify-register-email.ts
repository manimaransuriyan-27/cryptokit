// import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
// import { VERIFY_REGISTER_EMAIL_KEYS } from '@/lib/query-keys';
// import { verifyRegisterEmailService } from '@/services/auth.service';
// import type {
//   VerifyRegisterEmailCredentials,
//   VerifyRegisterEmailError,
// } from '@/types';

// type VerifyRegisterEmailResponse = Awaited<
//   ReturnType<typeof verifyRegisterEmailService>
// >;

// export function useVerifyRegisterEmailMutation(
//   options?: UseMutationOptions<
//     VerifyRegisterEmailResponse,
//     VerifyRegisterEmailError,
//     VerifyRegisterEmailCredentials
//   >
// ) {
//   return useMutation({
//     mutationKey: VERIFY_REGISTER_EMAIL_KEYS,
//     mutationFn: verifyRegisterEmailService,
//     ...options,
//   });
// }
