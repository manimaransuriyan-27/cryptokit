import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@repo/utils';
import rateLimit from 'express-rate-limit';
import type { NextFunction, Request, Response } from 'express';

/**
 * Strict Rate Limiter for sensitive authentication endpoints.
 * Limits an IP to 10 requests per 15-minute window.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers

  // Intercept the rate limit breach and route it through your AppError pipeline
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(ERROR_CODES.TOO_MANY_AUTH_REQUESTS));
  },
});

export const registerInitiateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Safe threshold: Limit each IP to 3 registration attempts per windowMs
  standardHeaders: true, // Returns standard RateLimit-* headers to the client
  legacyHeaders: false, // Disables outdated X-RateLimit-* headers
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(ERROR_CODES.TOO_MANY_REGISTRATION_REQUESTS));
  },
});

export const resendRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for resending
  // message: 'Too many requests from this IP, please try again after 15 minutes.',
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(ERROR_CODES.TOO_MANY_RESEND_REQUESTS));
  },
});
/**
 * Defensive Rate Limiter specifically tailored for token rotation endpoints.
 * Allows more overhead for multi-tab apps but prevents rapid flooding.
 */
export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 refresh requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(ERROR_CODES.TOO_MANY_REFRESH_REQUESTS));
  },
});
