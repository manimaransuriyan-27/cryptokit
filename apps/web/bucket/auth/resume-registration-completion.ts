import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { RESUME_COMPLETION_OF_REGISTRATION_KEYS } from '@/lib/query-keys';
import { resumeCompletionOfRegistrationService } from '@/services/auth.service';
import type {
  ResumeCompletionOfRegistrationCredentials,
  ResumeCompletionOfRegistrationError,
} from '@/types';

type ResumeCompletionOfRegistrationResponse = Awaited<
  ReturnType<typeof resumeCompletionOfRegistrationService>
>;

export function useResumeCompletionOfRegistrationMutation(
  options?: UseMutationOptions<
    ResumeCompletionOfRegistrationResponse,
    ResumeCompletionOfRegistrationError,
    ResumeCompletionOfRegistrationCredentials
  >
) {
  return useMutation({
    mutationKey: RESUME_COMPLETION_OF_REGISTRATION_KEYS,
    mutationFn: resumeCompletionOfRegistrationService,
    ...options,
  });
}
