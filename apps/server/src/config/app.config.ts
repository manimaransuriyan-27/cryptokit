import { env } from '@/config/env.config';

interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTesting: boolean;
}

export const appConfig = {
  env: env.NODE_ENV,
  port: parseInt(String(env.PORT) || '8010', 10),
  apiPrefix: '/api/v1',
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTesting: env.NODE_ENV === 'testing',
} satisfies AppConfig;
