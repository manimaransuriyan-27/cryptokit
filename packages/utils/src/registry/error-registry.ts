import { ERROR_CODES, type ErrorCode } from '../codes/error.code';

export const ERROR_REGISTRY: Record<
  ErrorCode,
  {
    message: string;
    statusCode: number;
  }
> = {
  // ─── Auth & Account State ────────────────────────────────────────────────────

  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: {
    message: 'Email already exists.',
    statusCode: 409,
  },
  [ERROR_CODES.EMAIL_IN_USE]: {
    message: 'Email is already in use.',
    statusCode: 409,
  },
  [ERROR_CODES.EMAIL_ALREADY_VERIFIED]: {
    message: 'Email already verified.',
    statusCode: 400,
  },
  [ERROR_CODES.PHONE_ALREADY_IN_USE]: {
    message: 'Phone number is already in use.',
    statusCode: 409,
  },
  [ERROR_CODES.INVALID_CREDENTIALS]: {
    message: 'Invalid email or password.',
    statusCode: 401,
  },
  [ERROR_CODES.CURRENT_PASSWORD_INCORRECT]: {
    message: 'Current password is incorrect.',
    statusCode: 401,
  },
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: {
    message: 'Email not verified. Please verify your email before logging in.',
    statusCode: 403,
  },
  [ERROR_CODES.ACCOUNT_BANNED]: {
    message: 'Your account has been banned. Contact support.',
    statusCode: 403,
  },
  [ERROR_CODES.ACCOUNT_SUSPENDED]: {
    message: 'Your account has been suspended. Contact support.',
    statusCode: 403,
  },
  [ERROR_CODES.ACCOUNT_LOCKED]: {
    message: 'Account locked. Please try again later.',
    statusCode: 423,
  },

  // ─── OTP & 2FA ───────────────────────────────────────────────────────────────

  [ERROR_CODES.INVALID_OTP]: {
    message: 'Invalid OTP.',
    statusCode: 400,
  },
  [ERROR_CODES.USER_ID_REQUIRED]: {
    statusCode: 400,
    message: 'User ID is required.',
  },
  [ERROR_CODES.INVALID_OTP_SESSION]: {
    message: 'Invalid OTP session.',
    statusCode: 400,
  },
  [ERROR_CODES.OTP_RATE_LIMIT_EXCEEDED]: {
    message: 'Too many OTP requests. Please try again in a few minutes.',
    statusCode: 429,
  },
  [ERROR_CODES.OTP_EXPIRED]: {
    message: 'OTP has expired. Please log in again to request a new one.',
    statusCode: 400,
  },
  [ERROR_CODES.TWO_FACTOR_NOT_ENABLED]: {
    message: 'Two-factor authentication is not enabled for this account.',
    statusCode: 400,
  },
  [ERROR_CODES.TWO_FACTOR_ALREADY_ENABLED]: {
    message: 'Two-factor authentication is already enabled.',
    statusCode: 409,
  },
  [ERROR_CODES.TWO_FACTOR_ALREADY_DISABLED]: {
    message: 'Two-factor authentication is already disabled.',
    statusCode: 409,
  },

  // ─── Verification Links & Tokens ─────────────────────────────────────────────

  [ERROR_CODES.INVALID_VERIFICATION_LINK]: {
    message: 'Invalid verification link.',
    statusCode: 400,
  },

  [ERROR_CODES.LINK_ALREADY_USED]: {
    message: 'This verification link has already been used.',
    statusCode: 409,
  },

  [ERROR_CODES.LINK_EXPIRED]: {
    message: 'This link has expired. Please request a new one.',
    statusCode: 410,
  },

  [ERROR_CODES.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN]: {
    message: 'Invalid or expired registration completion token.',
    statusCode: 400,
  },

  [ERROR_CODES.INVALID_SESSION_ID]: {
    message: 'Invalid session ID.',
    statusCode: 401, // if authentication-related
  },

  [ERROR_CODES.RESUME_REGISTRATION_COMPLETION]: {
    message: 'Please continue your registration to finish setting up your account.',
    statusCode: 409,
  },

  // ─── Refresh Tokens ──────────────────────────────────────────────────────────

  [ERROR_CODES.TOKEN_REUSE]: {
    message: 'Refresh token reuse detected. All sessions have been revoked.',
    statusCode: 403,
  },
  [ERROR_CODES.INVALID_REFRESH_TOKEN]: {
    message: 'Invalid refresh token.',
    statusCode: 401,
  },
  [ERROR_CODES.REFRESH_TOKEN_NOT_FOUND]: {
    message: 'Refresh token not found.',
    statusCode: 401,
  },
  [ERROR_CODES.REFRESH_TOKEN_REVOKED]: {
    message: 'Refresh token has been revoked.',
    statusCode: 401,
  },
  [ERROR_CODES.REFRESH_TOKEN_EXPIRED]: {
    message: 'Refresh token has expired.',
    statusCode: 401,
  },

  // ─── Registration Flow ───────────────────────────────────────────────────────

  [ERROR_CODES.REGISTRATION_RATE_LIMIT_EXCEEDED]: {
    message:
      'A verification link was recently sent to this address. Please check your inbox or wait 5 minutes before requesting another.',
    statusCode: 429,
  },
  [ERROR_CODES.REGISTRATION_ALREADY_COMPLETED]: {
    message: 'Registration already completed.',
    statusCode: 400,
  },
  [ERROR_CODES.REGISTRATION_NOT_INITIATED]: {
    message: 'Registration not started for this email. Please register first.',
    statusCode: 400,
  },

  // ─── Rate Limiting ───────────────────────────────────────────────────────────

  [ERROR_CODES.TOO_MANY_AUTH_REQUESTS]: {
    message:
      'Too many authentication attempts. Please try again after 15 minutes.',
    statusCode: 429,
  },
  [ERROR_CODES.TOO_MANY_REGISTRATION_REQUESTS]: {
    message:
      'Too many registration attempts from this IP. Please try again after 5 minutes.',
    statusCode: 409,
  },
  [ERROR_CODES.TOO_MANY_REFRESH_REQUESTS]: {
    message: 'Too many token refresh requests. Please try again later.',
    statusCode: 429,
  },
  [ERROR_CODES.TOO_MANY_RESEND_REQUESTS]: {
    message:
      'Too many requests from this IP, please try again after 15 minutes.',
    statusCode: 429,
  },
  [ERROR_CODES.RESEND_COOLDOWN_ACTIVE]: {
    message: 'Please wait before requesting another verification email.',
    statusCode: 429,
  },

  // ─── General ─────────────────────────────────────────────────────────────────

  [ERROR_CODES.USER_NOT_FOUND]: {
    message: 'User not found.',
    statusCode: 404,
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    message: 'Unauthorized.',
    statusCode: 401,
  },
  [ERROR_CODES.VALIDATION_ERROR]: {
    message: 'Validation failed.',
    statusCode: 400,
  },
  [ERROR_CODES.NOT_FOUND]: {
    message: 'Route not found.',
    statusCode: 404,
  },
  [ERROR_CODES.EMAIL_REQUIRED]: {
    message: 'Email is required.',
    statusCode: 400,
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    message: 'Something went wrong. Please try again later.',
    statusCode: 500,
  },
  [ERROR_CODES.UNKNOWN_ERROR]: {
    message: 'An unexpected error occurred.',
    statusCode: 500,
  },
};
