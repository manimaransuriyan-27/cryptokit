import { Role, UserStatus } from '@/generated/prisma/client';
import { type Request } from 'express';

// ─── Inputs ───────────────────────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface VerifyOtpInput {
  userId: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface CreateAdminInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  permissions?: string[];
  department?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string; // userId
  role: Role;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Express req augmentation ─────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  role: Role;
  status: UserStatus;
  sessionId: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

// ─── Service responses ────────────────────────────────────────────────────────

export interface LoginResponse {
  requiresOtp: boolean;
  userId?: string; // only when requiresOtp = true
  tokens?: TokenPair; // only when requiresOtp = false
}

export interface MessageResponse {
  message: string;
}
