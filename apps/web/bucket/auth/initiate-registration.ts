import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { INITIATE_REGISTRATION_KEYS } from '@/lib/query-keys';
import { initiateRegistrationService } from '@/services/auth.service';
import type {
  InitiateRegistrationCredentials,
  InitiateRegistrationError,
} from '@/types';

type InitiateRegistrationMutationResponse = Awaited<
  ReturnType<typeof initiateRegistrationService>
>;

export function useInitiateRegistrationMutation(
  options?: UseMutationOptions<
    InitiateRegistrationMutationResponse,
    InitiateRegistrationError,
    InitiateRegistrationCredentials
  >
) {
  return useMutation({
    mutationKey: INITIATE_REGISTRATION_KEYS,
    mutationFn: initiateRegistrationService,
    ...options,
  });
}
