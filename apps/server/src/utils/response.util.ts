import type { Response, Request, CookieOptions } from 'express';
import { SUCCESS_CODES, SUCCESS_REGISTRY } from '@repo/utils';
import type { SuccessCode } from '@repo/utils';
import { env } from '@/config/env.config';

export const sendSuccess = <T>(res: Response, code: SuccessCode, data?: T) => {
  const registryEntry = SUCCESS_REGISTRY[code];
  const statusCode = registryEntry?.statusCode || 200;
  const message = registryEntry?.message || 'Operation successful.';

  return res.status(statusCode).json({
    success: true,
    code,
    message,
    data,
  });
};

interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

export const sendAuthResponse = (
  req: Request,
  res: Response,
  tokens: TokenPayload,
  successCode: string = SUCCESS_CODES.SIGNIN_SUCCESS
) => {
  const { accessToken, refreshToken } = tokens;

  // ─── FIXED ───────────────────────────────────────────────────────────────────
  // The old logic was: clientPrefersCookies = x-auth-mode === 'cookie' || !!req.cookies?.refreshToken
  //
  // The second condition (!!req.cookies?.refreshToken) is ONLY true on a refresh
  // request where the cookie already exists — it is NEVER true on an initial login.
  // The first condition requires the frontend to explicitly send 'x-auth-mode: cookie',
  // which wasn't being done.
  //
  // Result: clientPrefersCookies was always false → tokens were returned in the JSON
  // body and silently discarded by the frontend, so no cookie was ever set.
  //
  // Fix: detect cookie preference explicitly. The x-auth-mode header approach is
  // clean and explicit — we just need to actually send it from the frontend (see
  // api-client.ts fix). Token-body fallback is kept for non-browser clients
  // (mobile apps, Postman, server-to-server).
  // ─────────────────────────────────────────────────────────────────────────────
  const clientPrefersCookies =
    req.headers['x-auth-mode'] === 'cookie' ||
    req.headers['x-client-type'] === 'web';

  // Base production-ready cookie security configuration
  const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    // 'none' for cross-site (e.g. Vercel → Railway), 'lax' for same-site dev
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  if (clientPrefersCookies) {
    // 1. Short-lived Access Token Cookie (15 min)
    res.cookie('accessToken', accessToken, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    // 2. Long-lived Refresh Token Cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Do NOT expose tokens to JS — HttpOnly cookies only
    return res.status(200).json({
      success: true,
      code: successCode,
      message:
        successCode === SUCCESS_CODES.SIGNIN_SUCCESS
          ? 'Login successful.'
          : 'Registration completed.',
    });
  }

  // ─── TOKEN-BASED FALLBACK (Mobile / Postman / Server-to-Server) ──────────────
  return res.status(200).json({
    success: true,
    code: successCode,
    message:
      successCode === SUCCESS_CODES.SIGNIN_SUCCESS
        ? 'Login successful.'
        : 'Registration completed.',
    data: {
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
};
