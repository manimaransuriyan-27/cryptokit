import { env } from '@/config/env.config';
import { AppError } from '@/errors/app-error';
import { TokenType } from '@/generated/prisma';
import { prisma } from '@/prisma/client';
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from '@repo/utils';
import bcrypt from 'bcryptjs';

import {
  sendLoginOtpEmail,
  sendVerificationEmail,
} from '@/mocks/email.service';
import type { TokenPair } from '@/types/auth.types';
import {
  generateFamily,
  generateOtp,
  generateSecureToken,
  hashToken,
  hoursFromNow,
  minutesFromNow,
} from '@/utils/crypto.util';
import {
  getRefreshTokenExpiry,
  issueTokenPair,
  verifyRefreshToken,
} from '@/utils/jwt.util';
import {
  sendAdminWelcomeEmail,
  sendOtpEmail,
  sendPasswordResetEmail,
} from '@/utils/mail.util';
import type {
  ChangePasswordSchemaInput,
  CreateAdminSchemaInput,
  LoginSchemaInput,
} from '@/validators/auth.validators';
import { assertAccountIsActive } from '@/utils/auth-guard.util';

const MAX_FAILED = 5;
const LOCK_MINUTES = 30;
const { SALT_ROUNDS } = env;

export async function initiateRegistration(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.passwordHash || existing.status === 'ACTIVE') {
      throw new AppError(ERROR_CODES.EMAIL_IN_USE);
    }

    if (existing.emailVerified) {
      throw new AppError(ERROR_CODES.EMAIL_ALREADY_VERIFIED);
    }

    const rateLimitWindowStart = new Date(Date.now() - 1 * 60 * 1000);
    const recentActiveToken = await prisma.token.findFirst({
      where: {
        userId: existing.id,
        type: TokenType.EMAIL_VERIFICATION,
        usedAt: null,
        createdAt: { gte: rateLimitWindowStart },
      },
    });

    if (recentActiveToken) {
      throw new AppError(ERROR_CODES.REGISTRATION_RATE_LIMIT_EXCEEDED);
    }

    await prisma.token.updateMany({
      where: {
        userId: existing.id,
        type: TokenType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const rawToken = generateSecureToken();

    await prisma.token.create({
      data: {
        userId: existing.id,
        type: TokenType.EMAIL_VERIFICATION,
        token: hashToken(rawToken),
        expiresAt: hoursFromNow(24),
      },
    });

    await sendVerificationEmail(
      existing.email,
      `${env.CLIENT_URL}/auth/register/verify-register-email?token=${rawToken}`
    );

    return { code: SUCCESS_CODES.REGISTRATION_INITIATED, email: existing.email };
  }

  const user = await prisma.user.create({
    data: { email, status: 'PENDING', role: 'CLIENT', profile: { create: {} } },
    select: { id: true, email: true },
  });

  const rawToken = generateSecureToken();
  await prisma.token.create({
    data: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
      token: hashToken(rawToken),
      expiresAt: hoursFromNow(24),
    },
  });

  await sendVerificationEmail(
    user.email,
    `${env.CLIENT_URL}/auth/register/verify-register-email?token=${rawToken}`
  );

  return { code: SUCCESS_CODES.REGISTRATION_INITIATED, email: user.email };
}

export async function verifyRegistrationEmail(rawToken: string) {
  const hashed = hashToken(rawToken);
  const record = await prisma.token.findUnique({
    where: { token: hashed },
    include: { user: true },
  });

  if (!record || record.type !== TokenType.EMAIL_VERIFICATION) {
    throw new AppError(ERROR_CODES.INVALID_VERIFICATION_LINK);
  }
  if (record.usedAt) {
    const isProfileCompleted = !!record.user.passwordHash;
    if (isProfileCompleted) {
      throw new AppError(ERROR_CODES.REGISTRATION_ALREADY_COMPLETED);
    } else if (record.user.emailVerified && !record.user.passwordHash) {
      throw new AppError(ERROR_CODES.RESUME_REGISTRATION_COMPLETION);
    }
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(ERROR_CODES.LINK_EXPIRED);
  }

  const completionToken = generateSecureToken();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.token.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.token.create({
      data: {
        userId: record.userId,
        type: TokenType.REGISTRATION_COMPLETION,
        token: hashToken(completionToken),
        expiresAt: minutesFromNow(30),
      },
    }),
  ]);

  return {
    code: SUCCESS_CODES.EMAIL_VERIFIED,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.EMAIL_VERIFIED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.EMAIL_VERIFIED]?.message,
    completionToken,
  };
}

export async function completeRegistration(
  rawCompletionToken: string,
  input: {
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
  }
) {
  const hashed = hashToken(rawCompletionToken);
  const record = await prisma.token.findUnique({ where: { token: hashed } });

  // Error validations using your central error registry
  if (!record || record.type !== TokenType.REGISTRATION_COMPLETION) {
    throw new AppError(
      ERROR_CODES.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN
    );
  }
  if (record.usedAt) {
    throw new AppError(ERROR_CODES.REGISTRATION_ALREADY_COMPLETED);
  }
  if (record.expiresAt < new Date()) {
    throw new AppError(ERROR_CODES.LINK_EXPIRED);
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });

  if (!user) {
    throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  }

  // Prevent users_phone_key unique constraint violation crash
  if (input.phone) {
    const existingUserWithPhone = await prisma.user.findFirst({
      where: {
        phone: input.phone,
        id: { not: user.id },
      },
    });

    if (existingUserWithPhone) {
      throw new AppError(ERROR_CODES.PHONE_ALREADY_IN_USE);
    }
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone || null,
        passwordHash,
        status: 'ACTIVE',
      },
    }),
    prisma.token.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    code: SUCCESS_CODES.REGISTRATION_COMPLETED,
    statusCode:
      SUCCESS_REGISTRY[SUCCESS_CODES.REGISTRATION_COMPLETED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.REGISTRATION_COMPLETED]?.message,
  };
}

export async function resendVerificationEmail(input: { email: string }) {
  const { email } = input;

  if (!email) {
    throw new AppError(ERROR_CODES.EMAIL_REQUIRED);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(ERROR_CODES.REGISTRATION_NOT_INITIATED);
  }

  if (user.emailVerified) {
    throw new AppError(ERROR_CODES.EMAIL_ALREADY_VERIFIED);
  }

  await prisma.token.updateMany({
    where: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  // Provision new credentials
  const rawToken = generateSecureToken();
  await prisma.token.create({
    data: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
      token: hashToken(rawToken),
      expiresAt: hoursFromNow(24),
    },
  });

  await sendVerificationEmail(
    email,
    `${env.CLIENT_URL}/auth/register/verify-register-email?token=${rawToken}`
  );
}

export async function resumeCompletionOfRegistration(email: string) {
  if (!email) {
    throw new AppError(ERROR_CODES.EMAIL_REQUIRED);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  }

  if (user.passwordHash || user.status === 'ACTIVE') {
    throw new AppError(ERROR_CODES.REGISTRATION_ALREADY_COMPLETED);
  }

  if (!user.emailVerified) {
    throw new AppError(ERROR_CODES.EMAIL_NOT_VERIFIED);
  }

  const completionToken = generateSecureToken();

  await prisma.token.updateMany({
    where: {
      userId: user.id,
      type: TokenType.REGISTRATION_COMPLETION,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await prisma.token.create({
    data: {
      userId: user.id,
      type: TokenType.REGISTRATION_COMPLETION,
      token: hashToken(completionToken),
      expiresAt: minutesFromNow(30),
    },
  });

  return {
    code: SUCCESS_CODES.GET_COMPLETION_REGISTRATION_TOKEN,
    completionToken,
  };
}

export async function getCompletionStatus(rawCompletionToken: string) {
  const hashed = hashToken(rawCompletionToken);

  const record = await prisma.token.findUnique({
    where: { token: hashed },
    include: { user: true },
  });

  if (!record || record.type !== TokenType.REGISTRATION_COMPLETION) {
    throw new AppError(ERROR_CODES.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN);
  }

  if (record.usedAt) {
    throw new AppError(ERROR_CODES.REGISTRATION_ALREADY_COMPLETED);
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(ERROR_CODES.LINK_EXPIRED);
  }

  return {
    email: record.user.email,
  };
}

export async function login(input: LoginSchemaInput, ipAddress?: string, userAgent?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  }

  assertAccountIsActive(user); // lockedUntil + BANNED + SUSPENDED in one call

  if (user.status === 'PENDING') throw new AppError(ERROR_CODES.EMAIL_NOT_VERIFIED);

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
      where: { userId: user.id, type: TokenType.TWO_FACTOR_SESSION, usedAt: null },
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
    };
  }

  const tokens = await createSessionAndTokens(user.id, user.role, ipAddress, userAgent);

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
    prisma.token.update({ where: { id: otpRecord.id }, data: { usedAt: new Date() } }),
    prisma.token.update({ where: { id: sessionRecord.id }, data: { usedAt: new Date() } }),
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

  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const recentToken = await prisma.token.findFirst({
    where: {
      userId: user.id,
      type: TokenType.TWO_FACTOR,
      usedAt: null,
      createdAt: { gte: twoMinutesAgo },
    },
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
  return {
    code: SUCCESS_CODES.LOGOUT_SUCCESS,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.LOGOUT_SUCCESS]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.LOGOUT_SUCCESS]?.message,
  };
}

// ==============================================================================
// 3. ACCOUNT RECOVERY ENGINE (PUBLIC)
// ==============================================================================

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If this email exists, a reset link was sent.' };

  await prisma.token.updateMany({
    where: { userId: user.id, type: TokenType.PASSWORD_RESET, usedAt: null },
    data: { usedAt: new Date() },
  });

  const rawToken = generateSecureToken();
  await prisma.token.create({
    data: {
      userId: user.id,
      type: TokenType.PASSWORD_RESET,
      token: hashToken(rawToken),
      expiresAt: hoursFromNow(1),
    },
  });

  await sendPasswordResetEmail(email, rawToken);
  return {
    code: SUCCESS_CODES.PASSWORD_RESET_EMAIL_SENT,
    statusCode:
      SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_RESET_EMAIL_SENT]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_RESET_EMAIL_SENT]?.message,
  };
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const hashed = hashToken(rawToken);
  const record = await prisma.token.findUnique({ where: { token: hashed } });

  if (!record || record.type !== TokenType.PASSWORD_RESET) {
    throw new AppError(ERROR_CODES.INVALID_VERIFICATION_LINK);
  }
  if (record.usedAt) throw new AppError(ERROR_CODES.LINK_ALREADY_USED);
  if (record.expiresAt < new Date())
    throw new AppError(ERROR_CODES.LINK_EXPIRED);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    }),
    prisma.token.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    }),
    prisma.session.updateMany({
      where: { userId: record.userId, isActive: true },
      data: { isActive: false },
    }),
  ]);

  return {
    code: SUCCESS_CODES.PASSWORD_RESET_SUCCESS,
    statusCode:
      SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_RESET_SUCCESS]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_RESET_SUCCESS]?.message,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      emailVerified: true,
      twoFactorEnabled: true,
      kycVerified: true,
      createdAt: true,
      profile: {
        select: { country: true, timezone: true, defaultCurrency: true },
      },
      adminProfile: { select: { permissions: true, department: true } },
    },
  });

  if (!user) {
    throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  }

  // Return the raw user object directly
  return user;
}

export async function changePassword(
  userId: string,
  input: ChangePasswordSchemaInput
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash)
    throw new AppError(ERROR_CODES.USER_NOT_FOUND);

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw new AppError(ERROR_CODES.CURRENT_PASSWORD_INCORRECT);

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    }),
    prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    }),
  ]);

  return {
    code: SUCCESS_CODES.PASSWORD_CHANGED,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_CHANGED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.PASSWORD_CHANGED]?.message,
  };
}

export async function requestEnable2FA(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash)
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  if (user.twoFactorEnabled)
    throw new AppError(ERROR_CODES.TWO_FACTOR_ALREADY_ENABLED);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);

  const otp = generateOtp();
  await prisma.token.updateMany({
    where: { userId, type: TokenType.TWO_FACTOR, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.token.create({
    data: {
      userId,
      type: TokenType.TWO_FACTOR,
      token: hashToken(otp),
      expiresAt: minutesFromNow(10),
    },
  });

  await sendOtpEmail(user.email, otp);

  return {
    code: SUCCESS_CODES.OTP_SENT,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.OTP_SENT]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.OTP_SENT]?.message,
  };
}

export async function verifyEnable2FA(userId: string, otp: string) {
  const hashed = hashToken(otp);
  const token = await prisma.token.findFirst({
    where: { userId, type: TokenType.TWO_FACTOR, token: hashed, usedAt: null },
  });

  if (!token) throw new AppError(ERROR_CODES.INVALID_OTP);
  if (token.expiresAt < new Date()) throw new AppError(ERROR_CODES.OTP_EXPIRED);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    }),
    prisma.token.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    code: SUCCESS_CODES.TWO_FACTOR_ENABLED,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.TWO_FACTOR_ENABLED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.TWO_FACTOR_ENABLED]?.message,
  };
}

export async function requestDisable2FA(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash)
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
  if (!user.twoFactorEnabled)
    throw new AppError(ERROR_CODES.TWO_FACTOR_ALREADY_DISABLED);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);

  const otp = generateOtp();
  await prisma.token.updateMany({
    where: { userId, type: TokenType.TWO_FACTOR, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.token.create({
    data: {
      userId,
      type: TokenType.TWO_FACTOR,
      token: hashToken(otp),
      expiresAt: minutesFromNow(10),
    },
  });

  await sendOtpEmail(user.email, otp);

  return {
    code: SUCCESS_CODES.OTP_SENT,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.OTP_SENT]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.OTP_SENT]?.message,
  };
}

export async function verifyDisable2FA(userId: string, otp: string) {
  const hashed = hashToken(otp);
  const token = await prisma.token.findFirst({
    where: { userId, type: TokenType.TWO_FACTOR, token: hashed, usedAt: null },
  });

  if (!token) throw new AppError(ERROR_CODES.INVALID_OTP);
  if (token.expiresAt < new Date()) throw new AppError(ERROR_CODES.OTP_EXPIRED);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false },
    }),
    prisma.token.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    code: SUCCESS_CODES.TWO_FACTOR_DISABLED,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.TWO_FACTOR_DISABLED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.TWO_FACTOR_DISABLED]?.message,
  };
}

// ==============================================================================
// 5. ADMINISTRATIVE OPERATIONS (PRIVILEGED)
// ==============================================================================

export async function createAdmin(
  input: CreateAdminSchemaInput,
  createdBy: string
) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) throw new AppError(ERROR_CODES.EMAIL_IN_USE);

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      status: 'ACTIVE',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      createdBy,
      adminProfile: {
        create: {
          permissions: input.permissions ?? [],
          department: input.department,
        },
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      adminProfile: { select: { permissions: true, department: true } },
    },
  });

  await sendAdminWelcomeEmail(input.email, input.password, input.role);

  return {
    code: SUCCESS_CODES.ADMIN_USER_CREATED,
    statusCode: SUCCESS_REGISTRY[SUCCESS_CODES.ADMIN_USER_CREATED]?.statusCode,
    message: SUCCESS_REGISTRY[SUCCESS_CODES.ADMIN_USER_CREATED]?.message,
    data: user,
  };
}

// ==============================================================================
// 6. PRIVATE INTERNAL UTILITIES (NON-EXPORTED)
// ==============================================================================

async function createSessionAndTokens(
  userId: string,
  role: any,
  ipAddress?: string,
  userAgent?: string
): Promise<TokenPair> {
  const family = generateFamily();

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken: generateSecureToken(16),
      ipAddress,
      userAgent,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const { accessToken, refreshToken: signedRefresh } = issueTokenPair(
    userId,
    role,
    session.id
  );
  const hashedRefresh = hashToken(signedRefresh);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashedRefresh,
      family,
      ipAddress,
      userAgent,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { accessToken, refreshToken: signedRefresh };
}
