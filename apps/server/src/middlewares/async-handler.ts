import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/app-error';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error | AppError) => {

      const statusCode = err instanceof AppError ? err.statusCode : 500;

      if (statusCode === 500) {
        console.error('💥 Unexpected Error:', err);
      }

      res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
      });
    });
  };

