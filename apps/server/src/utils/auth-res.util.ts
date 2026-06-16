import type { Response, Request, CookieOptions } from 'express';
import { env } from '@/config/env.config';
import { SUCCESS_CODES } from '@repo/utils';

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

  // Detect client preference safely
  const clientPrefersCookies =
    req.headers['x-auth-mode'] === 'cookie' || !!req.cookies?.refreshToken;

  // Base production-ready cookie security configuration
  const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    // Use 'none' for cross-site domains (e.g., Vercel to Heroku), or 'lax' for subdomains
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  if (clientPrefersCookies) {
    // 1. Set short-lived Access Token Cookie (e.g., 15 Mins)
    res.cookie('accessToken', accessToken, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    // 2. Set long-lived Refresh Token Cookie (e.g., 7 Days)
    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // For web apps using pure secure HttpOnly cookies, do not expose tokens to JavaScript
    return res.status(200).json({
      success: true,
      code: successCode,
      message:
        successCode === SUCCESS_CODES.SIGNIN_SUCCESS
          ? 'Login successful.'
          : 'Registration completed.',
    });
  }

  // ─── TOKEN-BASED FALLBACK (Mobile Apps / Postman / Server-to-Server) ───
  // If the client doesn't support or want cookies, return the tokens directly in the JSON payload
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
