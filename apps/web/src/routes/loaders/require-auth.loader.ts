import { getQueryClient } from '@/lib/query-client';
import { SESSION_QUERY_KEYS } from '@/lib/query-keys';
import { getMeService } from '@/services/auth.service';
import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

type UserSessionResponse = Awaited<ReturnType<typeof getMeService>>;

export const requireAuthLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<null | Response> => {
  const queryClient = getQueryClient();
  let user: UserSessionResponse | null = null;

  try {
    user = await queryClient.fetchQuery({
      queryKey: SESSION_QUERY_KEYS,
      queryFn: getMeService,
      staleTime: Infinity,
    });
  } catch {
    user = null;
  }

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}${url.hash}`;

    queryClient.setQueryData(SESSION_QUERY_KEYS, null);
    return redirect(`/auth/gz/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return null;
};
