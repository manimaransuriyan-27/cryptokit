import { appConfig } from '@/config/app.config';
import rateLimit from 'express-rate-limit';

// ─── Login: 10 attempts per 15 min per IP ────────────────────────────────────

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Register: 5 per hour per IP ────────────────────────────────────────────

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many registrations from this IP.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── OTP / email verify: 5 per 10 min per IP ─────────────────────────────────

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP attempts. Try again in 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Forgot password: 3 per hour per IP ─────────────────────────────────────

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many password reset requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: appConfig.isProduction ? 100 : 1000,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/health';
  },
});

// Strict rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
