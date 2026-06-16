import { redirect } from 'react-router-dom';
import { authQueries } from '@/hooks/queries';
import { getQueryClient } from '@/lib/query-client';
import { REGISTRATION_COMPLETION_STATUS_KEYS } from '@/lib/query-keys';

export const completeRegistrationLoader = async () => {
  const queryClient = getQueryClient();
  try {
    await queryClient.ensureQueryData(
      authQueries.registrationCompletionStatusQuery()
    );
    return null;
  } catch {
    queryClient.setQueryData(REGISTRATION_COMPLETION_STATUS_KEYS, null);
    queryClient.removeQueries({
      queryKey: REGISTRATION_COMPLETION_STATUS_KEYS,
    });
    return redirect('/auth/gz/register/initiate-registration');
  }
};
