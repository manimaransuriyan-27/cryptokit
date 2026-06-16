// auth.validators.ts
import { z } from 'zod';

// ==============================================================================
// 1. REGISTRATION PIPELINE SCHEMAS
// ==============================================================================

export const initiateRegistrationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email({ message: 'Please enter a valid email address.' }),
});

export const completeRegistrationSchema = z
  .object({
    // completionToken: z
    //   .string({ required_error: 'Completion token is required.' })
    //   .min(1, 'Completion token cannot be empty.'),
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters.' })
      .max(50, { message: 'First name is too long.' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters.' })
      .max(50, { message: 'Last name is too long.' }),
    phone: z.string().trim().optional().or(z.literal('')), // Safely bypasses evaluation if field remains unpopulated
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

// ==============================================================================
// 2. AUTHENTICATION & SESSION SCHEMAS
// ==============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email address.'),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const verifyOtpSchema = z.object({
  // userId: z
  //   .string({ required_error: 'User ID is required.' })
  //   .cuid('Invalid user ID format.'), // 💡 Fixed: Changed from .uuid() to match Prisma's .cuid()
  otp: z
    .string({ required_error: 'OTP code is required.' })
    .min(6, 'OTP must be exactly 6 characters.')
    .max(6, 'OTP must be exactly 6 characters.'),
});

export const resendLoginOtpSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

// ==============================================================================
// 3. ACCOUNT RECOVERY SCHEMAS
// ==============================================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email address.'),
});

export const resetPasswordSchema = z
  .object({
    token: z // 💡 Fixed: Added missing validation anchor for the routing parameters
      .string({ required_error: 'Reset token is required.' })
      .min(1, 'Reset token cannot be empty.'),
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

// ==============================================================================
// 4. ACTIVE PROFILE & SECURITY SCHEMAS (AUTHENTICATED)
// ==============================================================================

export const changePasswordSchema = z.object({
  currentPassword: z.string({
    required_error: 'Current password is required.',
  }),
  newPassword: z
    .string({ required_error: 'New password is required.' })
    .min(8, 'Password must be at least 8 characters long.'),
});

export const passwordSchema = z.object({
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const otpSchema = z.object({
  otp: z.string().min(6, 'OTP code must be at least 6 digits.'),
});

// ==============================================================================
// 5. ADMINISTRATIVE SCHEMAS
// ==============================================================================

export const createAdminSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Invalid email format.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters long.'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN'], {
    errorMap: () => ({ message: 'Role must be either ADMIN or SUPER_ADMIN.' }),
  }),
  permissions: z.array(z.string()).optional(),
  department: z.string().optional(),
});

// ==============================================================================
// 6. EXPORTED INFERENCE TYPES FOR TYPESCRIPT SAFETY
// ==============================================================================
export type InitiateRegistrationInput = z.infer<
  typeof initiateRegistrationSchema
>;
export type CompleteRegistrationSchemaInput = z.infer<
  typeof completeRegistrationSchema
>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;
export type VerifyOtpSchemaInput = z.infer<typeof verifyOtpSchema>;
export type ResendLoginOtpSchemaType = z.infer<typeof resendLoginOtpSchema>;
export type ForgotPasswordSchemaInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordSchemaInput = z.infer<typeof changePasswordSchema>;
export type PasswordSchemaInput = z.infer<typeof passwordSchema>;
export type OtpSchemaInput = z.infer<typeof otpSchema>;
export type CreateAdminSchemaInput = z.infer<typeof createAdminSchema>;
