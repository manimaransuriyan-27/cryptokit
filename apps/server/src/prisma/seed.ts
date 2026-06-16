import bcrypt from 'bcryptjs';
import { env } from '@/config/env.config';
import { prisma } from '@/prisma/client';
import { logger } from '@/utils/logger.util';

const { SALT_ROUNDS } = env; // 👈 Matches your core auth service precisely

async function main() {
  logger.info('Starting database seed script...');

  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    logger.error(
      'Seeding aborted: SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is missing in your environment configuration.'
    );
    process.exit(1);
  }

  // 1. Enforce Idempotency: Check if this user exists already
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    logger.warn(
      `Super Admin with email [${email}] already exists. Skipping allocation.`
    );
    return;
  }

  logger.info('Generating credential hashes for secure user creation...', {
    email,
  });
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 2. Execute atomic user and relation layout construction
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'System',
      lastName: 'SuperAdmin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      profile: {
        create: {},
      },
      adminProfile: {
        create: {
          department: 'Core Infrastructure',
          permissions: ['ALL_FUNCTIONS', 'MANAGE_ADMINS', 'BYPASS_LIMITS'],
        },
      },
    },
  });

  logger.info(
    'Database successfully bootstrapped with Super Admin account privileges.',
    {
      accountEmail: email,
      assignedDepartment: 'Core Infrastructure',
    }
  );
}

main()
  .catch((e) => {
    logger.error('Critical error encountered during database seeding', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info('Seed process finalized. Prisma client disconnected cleanly.');
  });
