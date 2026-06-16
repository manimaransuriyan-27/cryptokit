import jwt from 'jsonwebtoken';
import { Role } from '@/generated/prisma/client';
import { env } from '@/config/env.config';
import type { JwtPayload, TokenPair } from '@/types/auth.types';

const ACCESS_SECRET = env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = env.JWT_ACCESS_EXPIRY ?? '15m';
const REFRESH_EXPIRY = env.JWT_REFRESH_EXPIRY ?? '7d';

// ─── Sign ──────────────────────────────────────────────────────────────────────

export function signAccessToken(
  userId: string,
  role: Role,
  sessionId: string
): string {
  return jwt.sign({ sub: userId, role, sessionId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

export function signRefreshToken(
  userId: string,
  role: Role,
  sessionId: string
): string {
  return jwt.sign({ sub: userId, role, sessionId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  } as jwt.SignOptions);
}

export function issueTokenPair(
  userId: string,
  role: Role,
  sessionId: string
): TokenPair {
  return {
    accessToken: signAccessToken(userId, role, sessionId),
    refreshToken: signRefreshToken(userId, role, sessionId),
  };
}

// ─── Verify ────────────────────────────────────────────────────────────────────

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

// ─── Decode without verify (for expired token reads) ──────────────────────────

export function decodeToken(token: string): JwtPayload | null {
  return jwt.decode(token) as JwtPayload | null;
}

// ─── Refresh token expiry as Date ─────────────────────────────────────────────

export function getRefreshTokenExpiry(): Date {
  const days = parseInt(REFRESH_EXPIRY.replace('d', ''), 10) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
