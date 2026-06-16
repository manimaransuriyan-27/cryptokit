import type { Request, Response, NextFunction } from 'express';
import { appConfig } from '@/config/app.config';
import { logger } from '@/utils/logger.util';
import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@repo/utils';

// Main error handler
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const error =
    err instanceof AppError
      ? err
      : new AppError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        err instanceof Error ? err.message : undefined,
      );

  logger.error({
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  const response = {
    success: false,
    code: error.code,
    message: error.message,
    ...(appConfig.isDevelopment && {
      stack: error.stack,
    }),
  };
  res.status(error.statusCode).json(response);
};

// Async error wrapper - no need for try/catch
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
