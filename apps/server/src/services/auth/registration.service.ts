import bcrypt from 'bcryptjs';
import { env } from '@/config/env.config';
import { AppError } from '@/errors/app-error';
import { TokenType } from '@/generated/prisma';
import { sendVerificationEmail } from '@/mocks/email.service';
import { prisma } from '@/prisma/client';
import {
  generateSecureToken,
  hashToken,
  hoursFromNow,
  minutesFromNow,
} from '@/utils/crypto.util';
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from '@repo/utils';

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
      `${env.CLIENT_URL}/auth/gz/register/verify-email?token=${rawToken}`
    );

    return {
      code: SUCCESS_CODES.REGISTRATION_INITIATED,
      email: existing.email,
    };
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
    `${env.CLIENT_URL}/auth/gz/register/verify-email?token=${rawToken}`
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
    `${env.CLIENT_URL}/auth/gz/register/verify-email?token=${rawToken}`
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