// import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
// import { loginService } from '@/services/auth.service';
// import type { LoginCredentials, LoginError } from '@/types';
// import { LOGIN_KEYS } from '@/lib/query-keys';

// type LoginMutationResponse = Awaited<ReturnType<typeof loginService>>;

// export const useLoginMutation = (
//   options?: UseMutationOptions<
//     LoginMutationResponse,
//     LoginError,
//     LoginCredentials
//   >
// ) => {
//   return useMutation({
//     mutationKey: LOGIN_KEYS,
//     mutationFn: loginService,
//     ...options,
//   });
// };
