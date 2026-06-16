import { SESSION_QUERY_KEYS } from '@/lib/query-keys';
import { getMeService } from '@/services/auth.service';
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useSession({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isPending, isError, isSuccess } = useQuery<User | null>({
    queryKey: SESSION_QUERY_KEYS,
    queryFn: getMeService,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    enabled,
  });

  return {
    isAuthenticated: isSuccess && !!data,
    isInitialized: !enabled || !isPending || isError,
    isError,
  };
}
