import type { RootStore } from '@/stores/root.store';
import { createContext } from '@repo/hooks';

export const [useRootStore, RootStoreProvider, RootStoreContext] =
  createContext<RootStore>({
    name: 'RootStore',
  });
