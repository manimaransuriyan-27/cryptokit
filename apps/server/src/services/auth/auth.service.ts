import bcrypt from 'bcryptjs';
import { AppError } from '@/errors/app-error';
import { TokenType } from '@/generated/prisma';
import { sendLoginOtpEmail } from '@/mocks/email.service';
import { prisma } from '@/prisma/client';
import type { TokenPair } from '@/types/auth.types';
import { assertAccountIsActive } from '@/utils/auth-guard.util';
import {
  generateOtp,
  generateSecureToken,
  hashToken,
  minutesFromNow
} from '@/utils/crypto.util';
import {
  getRefreshTokenExpiry,
  issueTokenPair,
  verifyRefreshToken,
} from '@/utils/jwt.util';
import { createSessionAndTokens } from '@/utils/session-token.util';
import type { LoginSchemaInput } from '@/validators/auth.validators';
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from '@repo/utils';

const MAX_FAILED = 5;
const LOCK_MINUTES = 30;

export async function login(
  input: LoginSchemaInput,
  ipAddress?: string,
  userAgent?: string
) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  }

  assertAccountIsActive(user); // lockedUntil + BANNED + SUSPENDED in one call

  if (user.status === 'PENDING')
    throw new AppError(ERROR_CODES.EMAIL_NOT_VERIFIED);

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    const newCount = user.failedLoginCount + 1;
    const lockData =
      newCount >= MAX_FAILED
        ? { lockedUntil: minutesFromNow(LOCK_MINUTES), failedLoginCount: 0 }
        : { failedLoginCount: newCount };

    await prisma.user.update({ where: { id: user.id }, data: lockData });

    if (newCount >= MAX_FAILED) {
      throw new AppError(ERROR_CODES.ACCOUNT_LOCKED).withMeta({
        lockoutMinutes: LOCK_MINUTES,
        message: `Account locked. Try again in ${LOCK_MINUTES} minutes.`,
      });
    }
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    },
  });

  if (user.twoFactorEnabled) {
    const otp = generateOtp();

    await prisma.token.updateMany({
      where: { userId: user.id, type: TokenType.TWO_FACTOR, usedAt: null },
      data: { usedAt: new Date() },
    });
    await prisma.token.updateMany({
      where: {
        userId: user.id,
        type: TokenType.TWO_FACTOR_SESSION,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    await prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.TWO_FACTOR,
        token: hashToken(otp),
        expiresAt: minutesFromNow(10),
      },
    });

    const sessionToken = generateSecureToken();
    await prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.TWO_FACTOR_SESSION,
        token: hashToken(sessionToken),
        expiresAt: minutesFromNow(10),
      },
    });

    await sendLoginOtpEmail(user.email, otp);

    return {
      code: SUCCESS_CODES.TWO_FACTOR_REQUIRED,
      message: SUCCESS_REGISTRY[SUCCESS_CODES.TWO_FACTOR_REQUIRED]?.message,
      requiresOtp: true,
      sessionToken,
      userId: user.id,
    };
  }

  const tokens = await createSessionAndTokens(
    user.id,
    user.role,
    ipAddress,
    userAgent
  );

  return {
    code: SUCCESS_CODES.SIGNIN_SUCCESS,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.SIGNIN_SUCCESS]?.message,
    requiresOtp: false,
    tokens,
  };
}

export async function verifyOtp(
  sessionToken: string,
  otp: string,
  ipAddress?: string,
  userAgent?: string
) {
  const hashedSession = hashToken(sessionToken);

  const sessionRecord = await prisma.token.findUnique({
    where: { token: hashedSession },
    include: { user: true },
  });

  if (
    !sessionRecord ||
    sessionRecord.type !== TokenType.TWO_FACTOR_SESSION ||
    sessionRecord.usedAt ||
    sessionRecord.expiresAt < new Date()
  ) {
    throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
  }

  const user = sessionRecord.user;
  if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  assertAccountIsActive(user);

  const otpRecord = await prisma.token.findFirst({
    where: {
      userId: user.id,
      type: TokenType.TWO_FACTOR,
      usedAt: null,
    },
  });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new AppError(ERROR_CODES.OTP_EXPIRED);
  }

  if (otpRecord.token !== hashToken(otp)) {
    throw new AppError(ERROR_CODES.INVALID_OTP);
  }

  await prisma.$transaction([
    prisma.token.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    }),
    prisma.token.update({
      where: { id: sessionRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return createSessionAndTokens(user.id, user.role, ipAddress, userAgent);
}

export async function resendLoginOtp(sessionToken: string) {
  const hashedSession = hashToken(sessionToken);

  const sessionRecord = await prisma.token.findUnique({
    where: { token: hashedSession },
    include: { user: true },
  });

  if (
    !sessionRecord ||
    sessionRecord.type !== TokenType.TWO_FACTOR_SESSION ||
    sessionRecord.usedAt ||
    sessionRecord.expiresAt < new Date()
  ) {
    throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
  }

  const user = sessionRecord.user;
  if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  assertAccountIsActive(user);

  if (!user.twoFactorEnabled) {
    throw new AppError(ERROR_CODES.TWO_FACTOR_NOT_ENABLED);
  }

  const rateLimitDurationMs = 2 * 60 * 1000;
  const rateLimitWindowStart = new Date(Date.now() - rateLimitDurationMs);
  const recentToken = await prisma.token.findFirst({
    where: {
      userId: user.id,
      type: TokenType.TWO_FACTOR,
      usedAt: null,
      createdAt: { gte: rateLimitWindowStart },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recentToken) {
    throw new AppError(ERROR_CODES.OTP_RATE_LIMIT_EXCEEDED);
  }

  await prisma.token.updateMany({
    where: { userId: user.id, type: TokenType.TWO_FACTOR, usedAt: null },
    data: { usedAt: new Date() },
  });

  const otp = generateOtp();
  await prisma.token.create({
    data: {
      userId: user.id,
      type: TokenType.TWO_FACTOR,
      token: hashToken(otp),
      expiresAt: minutesFromNow(10),
    },
  });

  await sendLoginOtpEmail(user.email, otp);
}

export async function get2FASessionStatus(sessionToken: string) {
  const hashed = hashToken(sessionToken);

  const record = await prisma.token.findUnique({
    where: { token: hashed },
    include: { user: true },
  });

  if (
    !record ||
    record.type !== TokenType.TWO_FACTOR_SESSION ||
    record.usedAt ||
    record.expiresAt < new Date()
  ) {
    throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
  }

  return {
    email: record.user.email,
  };
}

export async function refreshTokens(
  rawRefreshToken: string,
  ipAddress?: string,
  userAgent?: string
): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError(ERROR_CODES.INVALID_REFRESH_TOKEN);
  }

  const hashed = hashToken(rawRefreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashed },
  });

  if (!stored) throw new AppError(ERROR_CODES.REFRESH_TOKEN_NOT_FOUND);

  if (stored.replacedBy || stored.isRevoked) {
    await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { family: stored.family },
        data: { isRevoked: true, revokedAt: new Date() },
      }),
      prisma.session.update({
        where: { id: payload.sessionId },
        data: { isActive: false },
      }),
    ]);
    throw new AppError(ERROR_CODES.TOKEN_REUSE);
  }

  if (stored.expiresAt < new Date())
    throw new AppError(ERROR_CODES.REFRESH_TOKEN_EXPIRED);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true },
  });
  if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);

  const newTokenPair = issueTokenPair(user.id, user.role, payload.sessionId);
  const newHashedRefresh = hashToken(newTokenPair.refreshToken);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: stored.id },
      data: { replacedBy: newHashedRefresh },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newHashedRefresh,
        family: stored.family,
        ipAddress,
        userAgent,
        expiresAt: getRefreshTokenExpiry(),
      },
    }),
    prisma.session.update({
      where: { id: payload.sessionId },
      data: { lastSeenAt: new Date() },
    }),
  ]);

  return newTokenPair;
}

export async function logout(sessionId: string, rawRefreshToken?: string) {
  if (!sessionId) throw new AppError(ERROR_CODES.INVALID_SESSION_ID);

  const updates: Promise<any>[] = [];

  if (sessionId) {
    updates.push(
      prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false },
      })
    );
  }

  if (rawRefreshToken) {
    const hashed = hashToken(rawRefreshToken);
    updates.push(
      prisma.refreshToken.updateMany({
        where: { tokenHash: hashed },
        data: { isRevoked: true, revokedAt: new Date() },
      })
    );
  } else throw new AppError(ERROR_CODES.UNAUTHORIZED);

  await Promise.all(updates);
}

