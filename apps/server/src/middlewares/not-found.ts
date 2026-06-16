import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@repo/utils';

/**
 * 404 Not Found Middleware
 * Should be placed **after** all routes but **before** the global error handler
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const error = new AppError(
        ERROR_CODES.NOT_FOUND,
        `Route ${req.originalUrl} not found`
    );

    next(error);
};