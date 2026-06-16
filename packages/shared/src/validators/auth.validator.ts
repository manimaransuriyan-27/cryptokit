import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required.')
  .email('Invalid email.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const loginOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const resendLoginOtpSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'userId is required'),
  }),
});

export const registerInitiateSchema = z.object({
  email: emailSchema,
});

export const completeRegistrationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: 'Name must be at least 2 characters.' }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: 'Name must be at least 2 characters.' }),
    phone: z
      .string()
      .min(1, 'Phone number is required') // Blocks empty submissions
      .refine(isValidPhoneNumber, {
        message: 'Please enter a valid phone number for your selected country',
      }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'], // Highlights the confirm password field on error
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
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

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type LoginOtpSchemaType = z.infer<typeof loginOtpSchema>;
export type ResendLoginOtpSchemaType = z.infer<typeof resendLoginOtpSchema>;
export type RegisterInitiateSchemaType = z.infer<typeof registerInitiateSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type CompleteRegistrationSchemaType = z.infer<
  typeof completeRegistrationSchema
>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
