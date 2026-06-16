import { createHttpClient } from '@repo/services';

export const httpClient = createHttpClient({
  baseUrl: import.meta.env.VITE_API_URL,
  withCredentials: true,
  defaultHeaders: {
    'x-client-type': 'web',
  },
  onSessionExpired: (reason) => {
    window.dispatchEvent(
      new CustomEvent('app:unauthorized', { detail: reason })
    );
  },
});

// httpClient.interceptors.response.use((res) => res, (error) => {
//   if (error.response?.status === 401) {
//     handleUnauthorized()
//   }
//   return Promise.reject(error)
// });
