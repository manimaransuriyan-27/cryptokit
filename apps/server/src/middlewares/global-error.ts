import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/app-error';
import { logger } from '@/utils/logger.util';
import { appConfig } from '@/config/app.config';

export const globalErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error({
            code: err.code,
            message: err.message,
            stack: err.stack,
            url: _req.originalUrl,
            method: _req.method,
            ip: _req.ip,
        })
        return res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
        });
    }

    console.error('Unhandled Exception:', err);
    
    return res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later.',
        ...(appConfig.isDevelopment && {
            stack: err.stack,
        }),
    });
};