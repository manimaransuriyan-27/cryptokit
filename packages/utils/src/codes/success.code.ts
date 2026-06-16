export const SUCCESS_CODES = {
  // ─── Admin ───────────────────────────────────────────────────────────────────
  ADMIN_USER_CREATED: 'ADMIN_USER_CREATED',

  // ─── Registration ────────────────────────────────────────────────────────────
  REGISTRATION_INITIATED: 'REGISTRATION_INITIATED',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  REGISTRATION_COMPLETED: 'REGISTRATION_COMPLETED',
  GET_COMPLETION_REGISTRATION_TOKEN: 'GET_COMPLETION_REGISTRATION_TOKEN',
  COMPLETION_STATUS_VALID: 'COMPLETION_STATUS_VALID',

  // ─── Session ─────────────────────────────────────────────────────────────────
  SIGNIN_SUCCESS: 'SIGNIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',

  // ─── Email Verification ──────────────────────────────────────────────────────
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
  VERIFICATION_EMAIL_SENT: 'VERIFICATION_EMAIL_SENT',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',

  // ─── Password ────────────────────────────────────────────────────────────────
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_EMAIL_SENT: 'PASSWORD_RESET_EMAIL_SENT',

  // ─── Profile & Account ───────────────────────────────────────────────────────
  ACCOUNT_UPDATED: 'ACCOUNT_UPDATED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  PROFILE_FETCHED: 'PROFILE_FETCHED',

  // ─── OTP & 2FA ───────────────────────────────────────────────────────────────
  OTP_SENT: 'OTP_SENT',
  OTP_RESENT: 'OTP_RESENT',
  OTP_VERIFIED: 'OTP_VERIFIED',
  OTP_REQUIRED: 'OTP_REQUIRED',
  OTP_SESSION_VALID: 'OTP_SESSION_VALID',
  TWO_FACTOR_ENABLED: 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED: 'TWO_FACTOR_DISABLED',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  TWO_FACTOR_OTP_SENT: 'TWO_FACTOR_OTP_SENT',
  TWO_FACTOR_DISABLE_OTP_SENT: 'TWO_FACTOR_DISABLE_OTP_SENT',
} as const;

export type SuccessCode = (typeof SUCCESS_CODES)[keyof typeof SUCCESS_CODES];