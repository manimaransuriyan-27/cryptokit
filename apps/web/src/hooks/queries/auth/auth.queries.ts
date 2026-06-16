import { queryOptions } from '@tanstack/react-query';
import { REGISTRATION_COMPLETION_STATUS_KEYS } from '@/lib/query-keys';
import { getCompletionStatusService } from '@/services/auth.service';
import type { GetCompletionStatusError } from '@/types';

type GetRegistrationCompletionStatusQueryResponse = Awaited<
  ReturnType<typeof getCompletionStatusService>
>;

export const authQueries = {
  registrationCompletionStatusQuery: () =>
    queryOptions<
      GetRegistrationCompletionStatusQueryResponse,
      GetCompletionStatusError
    >({
      queryKey: REGISTRATION_COMPLETION_STATUS_KEYS,
      queryFn: () => getCompletionStatusService(),
      staleTime: 1000 * 60 * 5,
      retry: false,
    }),
};
