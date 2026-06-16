import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/authenticate';
import { authorizeSuperAdmin } from '@/middlewares/authorize';
import { validate } from '@/middlewares/validate';
import {
  authRateLimiter,
  refreshRateLimiter,
  registerInitiateLimiter,
  resendRateLimiter,
} from '@/middlewares/rate-limiter';
import * as schemas from '@/validators/auth.validators';

const router: Router = Router();

// ------- REGISTRATION --------

router.post(
  '/register/initiate',
  registerInitiateLimiter,
  validate(schemas.initiateRegistrationSchema),
  authController.initiateRegistration
);

router.post(
  '/register/verify-email',
  authRateLimiter,
  authController.verifyRegistrationEmail
);

router.post(
  '/register/resume-completion',
  authRateLimiter,
  validate(schemas.forgotPasswordSchema),
  authController.resumeCompletionOfRegistration
);

router.get(
  '/register/completion-status',
  authController.getCompletionStatus
);

router.post(
  '/register/complete',
  authRateLimiter,
  validate(schemas.completeRegistrationSchema),
  authController.completeRegistration
);

router.post(
  '/register/resend-verification',
  resendRateLimiter,
  authController.resendVerification
);

// ------- LOGIN & SESSION LIFECYCLE --------

router.post(
  '/login',
  authRateLimiter,
  validate(schemas.loginSchema),
  authController.login
);

router.get(
  '/login/session-status',
  authController.get2FASessionStatus
);

router.post(
  '/login/verify-otp',
  authRateLimiter,
  validate(schemas.verifyOtpSchema),
  authController.verifyOtp
);

router.post(
  '/login/resend-otp',
  resendRateLimiter,
  authController.resendLoginOtp
);

router.post(
  '/refresh-token',
  refreshRateLimiter,
  authController.refreshToken
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

// ------- PASSWORD RECOVERY --------

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(schemas.forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(schemas.resetPasswordSchema),
  authController.resetPassword
);

// ------- PROFILE --------

router.get(
  '/me',
  authenticate,
  authController.getMe
);

router.get(
  '/account-status',
  authenticate,
  authController.getUserAccountStatus
);

router.post(
  '/change-password',
  authenticate,
  validate(schemas.changePasswordSchema),
  authController.changePassword
);

// ------- TWO FACTOR AUTHENTICATION SETTINGS --------

router.post(
  '/2fa/enable/request',
  authenticate,
  validate(schemas.passwordSchema),
  authController.requestEnable2FA
);

router.post(
  '/2fa/enable/verify',
  authenticate,
  validate(schemas.otpSchema),
  authController.verifyEnable2FA
);

router.post(
  '/2fa/disable/request',
  authenticate,
  validate(schemas.passwordSchema),
  authController.requestDisable2FA
);

router.post(
  '/2fa/disable/verify',
  authenticate,
  validate(schemas.otpSchema),
  authController.verifyDisable2FA
);

// ------- ADMIN --------

router.post(
  '/admin/create',
  authenticate,
  authorizeSuperAdmin,
  validate(schemas.createAdminSchema),
  authController.createAdmin
);

export default router;
