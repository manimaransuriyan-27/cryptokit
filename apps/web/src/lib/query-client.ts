import { QueryClient } from '@tanstack/react-query';

let clientInstance: QueryClient | null = null;

export function getQueryClient() {
  if (!clientInstance) {
    clientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  }
  return clientInstance;
}
