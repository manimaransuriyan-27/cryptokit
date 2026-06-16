import { useRootStore } from '@/providers/store.provider';

export const useAuthStore = () => useRootStore().authStore;
