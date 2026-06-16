import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from "@repo/utils";
import { prisma } from '@/prisma/client';
import type { AuthRequest } from '@/types/auth.types';
import { verifyAccessToken } from '@/utils/jwt.util'; // Ensure this utility matches your setup
import type { NextFunction, Response } from 'express';
import { asyncHandler } from './async-handler';

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Extract token from Authorization Header or HttpOnly Cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } 

    if (!token) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }

    // 2. Verify Access Token Structure and Signature
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }

    // 3. Verify Database Session is active (Critical for instant logout/revocation tracking)
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      select: {
        isActive: true,
        expiresAt: true,
        user: { select: { status: true } },
      },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }

    // 4. Attach stateful user descriptor directly to custom typed request context
    req.user = {
      id: payload.sub,
      role: payload.role,
      status: session.user.status,
      sessionId: payload.sessionId,
    };

    next();
  }
);
