// // src/errors/error-codes.ts

// export const ERROR_MESSAGESd = {
//   // Registration & Verification
//   EMAIL_ALREADY_EXISTS: 'Email already exists',
//   EMAIL_IN_USE: 'Email already in use',
//   EMAIL_ALREADY_VERIFIED: 'Email already verified',
//   INVALID_VERIFICATION_LINK: 'Invalid verification link',
//   LINK_ALREADY_USED: 'Link already used',
//   LINK_EXPIRED: 'Link expired. Request a new one.',

//   // Authentication & Credentials
//   INVALID_CREDENTIALS: 'Invalid email or password',
//   CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',

//   // Account Status Restrictions
//   EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
//   ACCOUNT_BANNED: 'Your account has been banned. Contact support.',
//   ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact support.',

//   // Multi-Factor Authentication (2FA)
//   INVALID_OTP: 'Invalid OTP',
//   OTP_EXPIRED: 'OTP expired. Login again to get a new one.',

//   // Refresh Tokens & Session Management
//   TOKEN_REUSE: 'Refresh token reuse detected. All sessions revoked.',
//   INVALID_REFRESH_TOKEN: 'Invalid refresh token',
//   REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
//   REFRESH_TOKEN_REVOKED: 'Refresh token revoked',
//   REFRESH_TOKEN_EXPIRED: 'Refresh token expired',

//   // Identity & Authorization
//   USER_NOT_FOUND: 'User not found',
//   UNAUTHORIZED: 'Unauthorized access',

//   // System & Request Validation
//   VALIDATION_ERROR: 'Validation failed',

//   TOO_MANY_AUTH_REQUESTS:
//     'Too many authentication attempts. Please try again after 15 minutes.',
//   TOO_MANY_REFRESH_REQUESTS:
//     'Too many token refresh requests. Please try again later.',
// } as const;

// // This ensures your keys are strictly typed and read-only
// export type ErrorMessageType =
//   (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
