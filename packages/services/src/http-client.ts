import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// Extend axios's internal config type so TypeScript knows about our custom flags
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRefresh?: boolean; // ← Available on initial requests now
  }
}

interface HttpClientOptions {
  baseUrl: string;
  withCredentials?: boolean;
  defaultHeaders?: Record<string, string>;
  onSessionExpired?: (reason: string) => void;
}

export function createHttpClient(options: HttpClientOptions): AxiosInstance {
  const {
    baseUrl,
    withCredentials = false,
    defaultHeaders = {},
    onSessionExpired,
  } = options;

  const client = axios.create({
    baseURL: baseUrl,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    },
  });

  let isRefreshing = false;
  let refreshQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];

  const processQueue = (error: unknown) => {
    refreshQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(null);
    });
    refreshQueue = [];
  };

  client.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      const errorCode = error.response?.data?.code;
      if (
        errorCode === 'ACCOUNT_BANNED' ||
        errorCode === 'ACCOUNT_SUSPENDED'
      ) {
        onSessionExpired?.(errorCode);
        return Promise.reject(error);
      }

      const is401 = error.response?.status === 401;
      const shouldSkip =
        originalRequest._skipAuthRefresh || // ← explicit opt-out
        originalRequest._retry; // ← already retried once

      if (is401 && !shouldSkip) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          })
            .then(() => client(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await client.post('/auth/refresh-token', null, {
            _skipAuthRefresh: true, // ← prevent the refresh call itself from looping
          });
          processQueue(null);
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          onSessionExpired?.('SESSION_EXPIRED');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}
