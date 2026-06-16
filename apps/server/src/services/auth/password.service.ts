import bcrypt from "bcryptjs";
import { env } from "@/config/env.config";
import { AppError } from "@/errors/app-error";
import { TokenType } from "@/generated/prisma";
import { prisma } from "@/prisma/client";
import { generateSecureToken, hashToken, hoursFromNow } from "@/utils/crypto.util";
import { sendPasswordResetEmail } from "@/utils/mail.util";
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from "@repo/utils";
import type { ChangePasswordSchemaInput } from "@/validators/auth.validators";

const { SALT_ROUNDS } = env;

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
