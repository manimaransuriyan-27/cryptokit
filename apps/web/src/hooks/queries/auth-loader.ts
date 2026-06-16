import { getQueryClient } from '@/lib/query-client';
import { SESSION_QUERY_KEYS } from '@/lib/query-keys';
import { getMeService } from '@/services/auth.service';
import type { User } from '@/types';
import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

export const requireAuthLoader = async ({ request }: LoaderFunctionArgs) => {
  const queryClient = getQueryClient();
  const user = queryClient.getQueryData<User | null>(SESSION_QUERY_KEYS);

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}${url.hash}`;
    queryClient.setQueryData(SESSION_QUERY_KEYS, null);

    return redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return null;
};

export const requireAuthLoaders = async ({ request }: LoaderFunctionArgs) => {
  let user = null;
  const queryClient = getQueryClient();

  try {
    user = await queryClient.fetchQuery({
      queryKey: SESSION_QUERY_KEYS,
      queryFn: getMeService,
      staleTime: 0,
    });
  } catch {
    user = null;
  }

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}${url.hash}`;
    return redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return null;
};
