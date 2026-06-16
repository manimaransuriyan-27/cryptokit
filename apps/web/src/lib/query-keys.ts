const SESSION_QUERY_KEYS = ['auth', 'session'] as const;
const LOGIN_KEYS = ['auth', 'login'] as const;
const LOGIN_OTP_KEYS = ['auth', 'login-otp'] as const;
const LOGIN_OTP_SESSION_STATUS_QUERY_KEYS = ['auth', 'login-otp-session-status'] as const;
const RESEND_LOGIN_OTP_KEYS = ['auth', 'resend-login-otp'] as const;
const LOGOUT_KEYS = ['auth', 'logout'] as const;
const INITIATE_REGISTRATION_KEYS = ['auth', 'initiate-registration'] as const;
const VERIFY_EMAIL_KEYS = ['auth', 'verify-email'] as const;
const COMPLETE_REGISTRATION_KEYS = ['auth', 'complete-registration'] as const;
const RESUME_COMPLETION_OF_REGISTRATION_KEYS = [
  'auth',
  'resume-completion-of-registration',
] as const;

const REGISTRATION_COMPLETION_STATUS_KEYS = [
  'auth',
  'registration-completion-status',
] as const;

export {
  SESSION_QUERY_KEYS,
  LOGIN_KEYS,
  LOGIN_OTP_KEYS,
  LOGIN_OTP_SESSION_STATUS_QUERY_KEYS,
  RESEND_LOGIN_OTP_KEYS,
  LOGOUT_KEYS,
  INITIATE_REGISTRATION_KEYS,
  VERIFY_EMAIL_KEYS,
  RESUME_COMPLETION_OF_REGISTRATION_KEYS,
  COMPLETE_REGISTRATION_KEYS,
  REGISTRATION_COMPLETION_STATUS_KEYS,
};
