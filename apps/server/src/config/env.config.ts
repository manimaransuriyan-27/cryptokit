import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  SUPERADMIN_EMAIL: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email.'),
  SUPERADMIN_PASSWORD: z
    .string()
    .min(8, 'SUPERADMIN_PASSWORD must be at least 8 characters'),
  DATABASE_HOST: z.coerce.string().default('localhost'),
  NODE_ENV: z
    .enum(['development', 'production', 'testing'])
    .default('development'),
  PORT: z.coerce.number().default(5005),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').url(),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required').url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  SALT_ROUNDS: z.coerce
    .number()
    .int()
    .refine((value) => value === 12, 'SALT_ROUNDS must be 12'),

  SMTP_PORT: z.coerce.number().default(587),
  FROM: z.string().min(1, 'From is required'),
  SMTP_FROM_EMAIL: z.string().min(1),
  RESEND_API_KEY: z.string().min(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
