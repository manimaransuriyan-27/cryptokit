import { prisma } from "@/prisma/client";
import type { TokenPair } from "@/types/auth.types";
import { generateFamily, generateSecureToken, hashToken } from "./crypto.util";
import { getRefreshTokenExpiry, issueTokenPair } from "./jwt.util";


export async function createSessionAndTokens(
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