import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { COMPLETE_REGISTRATION_KEYS } from '@/lib/query-keys';
import { completeRegistrationService } from '@/services/auth.service';
import type {
  CompleteRegistrationCredentials,
  CompleteRegistrationError,
} from '@/types';

type CompleteRegistrationMutationResponse = Awaited<
  ReturnType<typeof completeRegistrationService>
>;

export function useCompleteRegistrationMutation(
  options?: UseMutationOptions<
    CompleteRegistrationMutationResponse,
    CompleteRegistrationError,
    CompleteRegistrationCredentials
  >
) {
  return useMutation({
    mutationKey: COMPLETE_REGISTRATION_KEYS,
    mutationFn: completeRegistrationService,
    ...options,
  });
}
