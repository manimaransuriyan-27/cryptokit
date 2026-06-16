import { useEffect } from 'react';
import { useSessionStorage } from '@uidotdev/usehooks';
import { useAuthStore } from './use-auth-store';

const KEY = 'cryptokit.reg.completion_token';

export const useCompletionToken = () => {
  const authStore = useAuthStore();
  const [storedToken, setStoredToken] = useSessionStorage<string | null>(
    KEY,
    null
  );

  useEffect(() => {
    if (!authStore.completionToken && storedToken) {
      authStore.setCompletionToken(storedToken);
    }
  }, []);

  const setCompletionToken = (token: string) => {
    authStore.setCompletionToken(token);
    setStoredToken(token);
  };

  const clearCompletionToken = () => {
    authStore.setCompletionToken(null);
    setStoredToken(null);
  };

  const completionToken = authStore.completionToken ?? storedToken;

  return { completionToken, setCompletionToken, clearCompletionToken };
};
