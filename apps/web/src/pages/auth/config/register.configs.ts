// import type { ErrorCode, SuccessCode } from '@repo/utils';

// // ─── 1. Full-Page Views (Success milestones & unrecoverable entry links) ─────
// export const REGISTER_PAGE_CODES = [
//   'REGISTRATION_INITIATED',
//   'EMAIL_VERIFIED',
//   'REGISTRATION_COMPLETED',
//   'INVALID_VERIFICATION_LINK',
//   'LINK_ALREADY_USED',
//   'REGISTRATION_NOT_INITIATED',
// ] as const satisfies readonly (SuccessCode | ErrorCode)[];

// // ─── 2. Inline Action Warnings (Edge cases, resends, and spam controls) ──────
// export const REGISTER_WARN_NOTIFICATION_CODES = [
//   'EMAIL_ALREADY_VERIFIED',
//   'REGISTRATION_ALREADY_COMPLETED',
//   'VERIFICATION_EMAIL_SENT',
//   'TOO_MANY_RESEND_REQUESTS',
// ] as const satisfies readonly (SuccessCode | ErrorCode)[];

// // ─── 3. Form Blocking Errors (User input issues or strict rate limits) ───────
// export const REGISTER_NOTIFICATION_CODES = [
//   'EMAIL_IN_USE',
//   'PHONE_ALREADY_IN_USE',
//   'REGISTRATION_RATE_LIMIT_EXCEEDED',
//   'TOO_MANY_REGISTRATION_REQUESTS',
//   'UNKNOWN_ERROR',
// ] as const satisfies readonly ErrorCode[];

// // ─── Exported Type Alignments ────────────────────────────────────────────────
// export type RegisterPageCode = (typeof REGISTER_PAGE_CODES)[number];
// export type RegisterWarningCode =
//   (typeof REGISTER_WARN_NOTIFICATION_CODES)[number];
// export type RegisterNotificationCode =
//   (typeof REGISTER_NOTIFICATION_CODES)[number];

// // ─── Static Route Destination ────────────────────────────────────────────────
// export const REGISTER_FEEDBACK_ROUTE = '/auth/register/feedback';

// // ─── 4. History & Navigation Routing Map ────────────────────────────────────
// interface NavigationBehavior {
//   replaceOnEntry: boolean;
//   nextRoute?: string;
//   replaceOnExit?: boolean;
// }

// export const REGISTER_PAGE_NAVIGATION: Record<
//   RegisterPageCode,
//   NavigationBehavior
// > = {
//   REGISTRATION_INITIATED: { replaceOnEntry: true },
//   EMAIL_VERIFIED: {
//     replaceOnEntry: true,
//     nextRoute: '/auth/register/complete',
//     replaceOnExit: true,
//   },
//   REGISTRATION_COMPLETED: {
//     replaceOnEntry: true,
//     nextRoute: '/auth/login',
//     replaceOnExit: true,
//   },
//   INVALID_VERIFICATION_LINK: {
//     replaceOnEntry: false,
//     nextRoute: '/auth/register',
//     replaceOnExit: false,
//   },
//   LINK_ALREADY_USED: {
//     replaceOnEntry: false,
//     nextRoute: '/auth/register',
//     replaceOnExit: false,
//   },
//   REGISTRATION_NOT_INITIATED: {
//     replaceOnEntry: false,
//     nextRoute: '/auth/register',
//     replaceOnExit: false,
//   },
// };

// export const isRegisterPageCode = (code: unknown): code is RegisterPageCode => {
//   return (
//     typeof code === 'string' &&
//     (REGISTER_PAGE_CODES as readonly string[]).includes(code)
//   );
// };

// export const isRegisterWarningCode = (
//   code: unknown
// ): code is RegisterWarningCode => {
//   return (
//     typeof code === 'string' &&
//     (REGISTER_WARN_NOTIFICATION_CODES as readonly string[]).includes(code)
//   );
// };

// export const isRegisterNotificationCode = (
//   code: unknown
// ): code is RegisterNotificationCode => {
//   return (
//     typeof code === 'string' &&
//     (REGISTER_NOTIFICATION_CODES as readonly string[]).includes(code)
//   );
// };

// // ─── Contextual Copy Resolvers ───────────────────────────────────────────────
// export const getNotificationMessage = (
//   code: RegisterNotificationCode
// ): string => {
//   const messages: Record<RegisterNotificationCode, string> = {
//     EMAIL_IN_USE: 'This email is already registered. Try logging in.',
//     PHONE_ALREADY_IN_USE: 'This phone number is linked to another account.',
//     TOO_MANY_REGISTRATION_REQUESTS: 'Please try again after 5 minutes.',
//     REGISTRATION_RATE_LIMIT_EXCEEDED:
//       'A verification link was recently sent to this address. Please try again after 5 minutes.',
//     UNKNOWN_ERROR: 'Something went wrong. Please try again later.',
//   };
//   return messages[code] || 'An unexpected registration issue occurred.';
// };

// export const getWarningMessage = (code: RegisterWarningCode): string => {
//   const messages: Record<RegisterWarningCode, string> = {
//     EMAIL_ALREADY_VERIFIED:
//       'Your email has already been verified! Please sign in.',
//     REGISTRATION_ALREADY_COMPLETED:
//       'Your account setup is already complete. Proceed to log in.',
//     VERIFICATION_EMAIL_SENT:
//       'A fresh verification link has been sent to your email inbox.',
//     TOO_MANY_RESEND_REQUESTS:
//       'Slow down! Please wait a few minutes before requesting another link.',
//   };
//   return messages[code] || 'Action cannot be re-executed at this time.';
// };
