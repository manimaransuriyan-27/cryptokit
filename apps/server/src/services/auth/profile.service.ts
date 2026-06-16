import { AppError } from "@/errors/app-error";
import { prisma } from "@/prisma/client";
import { ERROR_CODES, SUCCESS_CODES } from "@repo/utils";

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

    return user;
}

export async function getUserAccountStatus(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            status: true,        // Houses 'ACTIVE', 'BANNED', 'SUSPENDED', 'PENDING'
            lockedUntil: true,   // Holds the lockout expiration timestamp
        },
    });

    if (!user) {
        throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    }

    // Determine if the login lockout timer is currently active
    const isLocked = user.lockedUntil ? user.lockedUntil > new Date() : false;

    return {
        id: user.id,
        currentStatus: user.status, // e.g., 'BANNED', 'SUSPENDED', 'ACTIVE'
        isBanned: user.status === 'BANNED',
        isSuspended: user.status === 'SUSPENDED',
        isLocked: isLocked,
        lockedUntil: user.lockedUntil,
    };
}