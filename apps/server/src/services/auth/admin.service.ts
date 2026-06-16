import bcrypt from "bcryptjs";
import { env } from "@/config/env.config";
import { AppError } from "@/errors/app-error";
import { prisma } from "@/prisma/client";
import { sendAdminWelcomeEmail } from "@/utils/mail.util";
import type { CreateAdminSchemaInput } from "@/validators/auth.validators";
import { ERROR_CODES, SUCCESS_CODES, SUCCESS_REGISTRY } from "@repo/utils";

const { SALT_ROUNDS } = env;

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
        message: SUCCESS_REGISTRY[SUCCESS_CODES.ADMIN_USER_CREATED]?.message,
        data: user,
    };
}
