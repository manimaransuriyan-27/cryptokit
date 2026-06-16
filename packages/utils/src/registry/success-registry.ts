import { SUCCESS_CODES, type SuccessCode } from '../codes/success.code';

export const SUCCESS_REGISTRY: Record<
  SuccessCode,
  {
    message: string;
    statusCode: number;
  }
> = {
  // ─── Admin ───────────────────────────────────────────────────────────────────

  [SUCCESS_CODES.ADMIN_USER_CREATED]: {
    message: 'Admin user created successfully.',
    statusCode: 201,
  },

  // ─── Registration ────────────────────────────────────────────────────────────

  [SUCCESS_CODES.REGISTRATION_INITIATED]: {
    message: 'Registration started. Please check your email to verify your account.',
    statusCode: 201,
  },
  [SUCCESS_CODES.SIGNUP_SUCCESS]: {
    message: 'Account created successfully. Please verify your email.',
    statusCode: 201,
  },
  [SUCCESS_CODES.REGISTRATION_COMPLETED]: {
    message: 'Registration completed successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.GET_COMPLETION_REGISTRATION_TOKEN]: {
    message: 'Registration compeletion token fetched successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.COMPLETION_STATUS_VALID]: {
    message: 'Registration compeletion status is valid.',
    statusCode: 200,
  },
  // ─── Session ─────────────────────────────────────────────────────────────────

  [SUCCESS_CODES.SIGNIN_SUCCESS]: {
    message: 'Logged in successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.LOGOUT_SUCCESS]: {
    message: 'Logged out successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TOKEN_REFRESHED]: {
    message: 'Token refreshed successfully.',
    statusCode: 200,
  },

  // ─── Email Verification ──────────────────────────────────────────────────────

  [SUCCESS_CODES.EMAIL_VERIFIED]: {
    message: 'Email verified successfully. Please complete your profile to finish registration.',
    statusCode: 200,
  },
  [SUCCESS_CODES.VERIFICATION_EMAIL_SENT]: {
    message: 'Verification email sent successfully. Please check your inbox to verify your account.',
    statusCode: 200,
  },
  [SUCCESS_CODES.EMAIL_ALREADY_VERIFIED]: {
    message: 'Email already verified. Please continue your registration to finish setting up your account.',
    statusCode: 200,
  },

  // ─── Password ────────────────────────────────────────────────────────────────

  [SUCCESS_CODES.PASSWORD_CHANGED]: {
    message: 'Password changed successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.PASSWORD_RESET_SUCCESS]: {
    message: 'Password reset successfully. You can now log in with your new password.',
    statusCode: 200,
  },
  [SUCCESS_CODES.PASSWORD_RESET_EMAIL_SENT]: {
    message: 'A password reset link has been sent to your email.',
    statusCode: 200,
  },

  // ─── Profile & Account ───────────────────────────────────────────────────────

  [SUCCESS_CODES.ACCOUNT_UPDATED]: {
    message: 'Account updated successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.PROFILE_UPDATED]: {
    message: 'Profile updated successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.PROFILE_FETCHED]: {
    message: 'Profile fetched successfully.',
    statusCode: 200,
  },

  // ─── OTP & 2FA ───────────────────────────────────────────────────────────────

  [SUCCESS_CODES.OTP_SENT]: {
    message: 'OTP sent successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.OTP_RESENT]: {
    message: 'OTP resent successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.OTP_VERIFIED]: {
    message: 'OTP verified successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.OTP_REQUIRED]: {
    message: 'OTP verification is required.',
    statusCode: 200,
  },
  [SUCCESS_CODES.OTP_SESSION_VALID]: {
    message: 'OTP session is valid.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TWO_FACTOR_ENABLED]: {
    message: 'Two-factor authentication enabled successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TWO_FACTOR_DISABLED]: {
    message: 'Two-factor authentication disabled successfully.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TWO_FACTOR_REQUIRED]: {
    message: 'Two-factor authentication is required.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TWO_FACTOR_OTP_SENT]: {
    message: 'OTP sent successfully. Please verify it to enable 2FA.',
    statusCode: 200,
  },
  [SUCCESS_CODES.TWO_FACTOR_DISABLE_OTP_SENT]: {
    message: 'OTP sent successfully. Please verify it to disable 2FA.',
    statusCode: 200,
  },
};