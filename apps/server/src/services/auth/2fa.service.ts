import bcrypt from "bcryptjs";
import { AppError } from "@/errors/app-error";
import { TokenType } from "@/generated/prisma";
import { prisma } from "@/prisma/client";
import { generateOtp, hashToken, minutesFromNow } from "@/utils/crypto.util";
import { sendOtpEmail } from "@/utils/mail.util";
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from "@repo/utils";

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