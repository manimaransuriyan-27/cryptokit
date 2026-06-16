import morgan from 'morgan';
import { appConfig } from '@/config/app.config';
import { logger } from '@/utils/logger.util';

// Custom token for colored status codes
morgan.token('status-colored', (_req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? '\x1b[31m' // red
      : status >= 400
        ? '\x1b[33m' // yellow
        : status >= 300
          ? '\x1b[36m' // cyan
          : status >= 200
            ? '\x1b[32m' // green
            : '\x1b[0m'; // no color

  return `${color}${status}\x1b[0m`;
});

// Development format - human readable
const developmentFormat =
  ':method :url :status-colored :response-time ms - :res[content-length]';

// Production format - JSON for log aggregation
const productionFormat = JSON.stringify({
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time ms',
  contentLength: ':res[content-length]',
  userAgent: ':user-agent',
  ip: ':remote-addr',
});

export const requestLogger = morgan(
  appConfig.isDevelopment ? developmentFormat : productionFormat,
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
    skip: (req) => {
      // Skip logging health checks in production
      return appConfig.isProduction && req?.url === '/health';
    },
  },
);
