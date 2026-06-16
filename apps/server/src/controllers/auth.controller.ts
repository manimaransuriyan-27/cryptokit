import type { Request, Response } from 'express';
import { appConfig } from '@/config/app.config';
import { AppError } from '@/errors/app-error';
import * as twoFactorAuthService from '@/services/auth/2fa.service';
import * as adminAuthService from '@/services/auth/admin.service';
import * as authService from '@/services/auth/auth.service';
import * as passwordAuthService from '@/services/auth/password.service';
import * as profileAuthService from '@/services/auth/profile.service';
import * as registrationAuthService from '@/services/auth/registration.service';
import type { AuthRequest } from '@/types/auth.types';
import { asyncHandler } from '@/utils/async-handler.util';
import { sendAuthResponse, sendSuccess } from '@/utils/response.util';
import { ERROR_CODES, SUCCESS_CODES } from '@repo/utils';

export const initiateRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, email } = await registrationAuthService.initiateRegistration(
      req.body.email
    );

    return sendSuccess(res, code, { email });
  }
);

export const verifyRegistrationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const token = (req.query.token || req.body.token) as string;

    if (!token) {
      throw new AppError(ERROR_CODES.INVALID_VERIFICATION_LINK);
    }

    const result = await registrationAuthService.verifyRegistrationEmail(token);

    res.cookie('completionToken', result.completionToken, {
      httpOnly: true,
      secure: appConfig.isProduction,
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000,
      path: `${appConfig.apiPrefix}/auth`,
    });

    return sendSuccess(res, SUCCESS_CODES.EMAIL_VERIFIED);
  }
);

export const resumeCompletionOfRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result =
      await registrationAuthService.resumeCompletionOfRegistration(email);

    res.cookie('completionToken', result.completionToken, {
      httpOnly: true,
      secure: appConfig.isProduction,
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000,
      path: `${appConfig.apiPrefix}/auth`,
    });

    return sendSuccess(res, result.code, {});
  }
);

export const getCompletionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const completionToken = req.cookies?.completionToken;

    if (!completionToken) {
      throw new AppError(
        ERROR_CODES.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN
      );
    }

    const result =
      await registrationAuthService.getCompletionStatus(completionToken);

    return sendSuccess(
      res,
      SUCCESS_CODES.COMPLETION_STATUS_VALID,
      result
    );
  }
);

export const completeRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const completionToken = req.cookies?.completionToken;

    if (!completionToken) {
      throw new AppError(
        ERROR_CODES.INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN
      );
    }

    const result = await registrationAuthService.completeRegistration(
      completionToken,
      req.body
    );

    res.clearCookie('completionToken', {
      path: `${appConfig.apiPrefix}/auth`,
      secure: appConfig.isProduction,
      sameSite: 'lax',
    });

    return sendSuccess(res, result.code, result);
  }
);

export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await registrationAuthService.resendVerificationEmail(
      req.body
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.VERIFICATION_EMAIL_SENT,
      result
    );
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login(
      req.body,
      req.ip,
      req.headers['user-agent']
    );

    // Path A: 2FA is required. Handle cookies and return early.
    if (result.requiresOtp) {
      res.cookie('twoFactorSession', result.sessionToken, {
        httpOnly: true,
        secure: appConfig.isProduction,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000,
        path: `${appConfig.apiPrefix}/auth`,
      });

      res.cookie('twoFaUserId', result.userId, {
        httpOnly: false,
        secure: appConfig.isProduction,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000,
        path: `${appConfig.apiPrefix}/auth`,
      });

      return sendSuccess(
        res,
        SUCCESS_CODES.OTP_REQUIRED,
        { requiresOtp: true }
      );
    }

    // Path B: Direct Login Success. 
    // TypeScript now knows that if we passed the block above, 'tokens' MUST exist on 'result'.
    if (!result?.tokens) {
      throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR);
    }

    return sendAuthResponse(
      req,
      res,
      result.tokens, // <-- The TypeScript error is now gone!
      SUCCESS_CODES.SIGNIN_SUCCESS
    );
  }
);

export const get2FASessionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies?.twoFactorSession;

    if (!sessionToken) {
      throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
    }

    const result =
      await authService.get2FASessionStatus(sessionToken);

    return sendSuccess(
      res,
      SUCCESS_CODES.OTP_SESSION_VALID,
      result
    );
  }
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies?.twoFactorSession;

    if (!sessionToken) {
      throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
    }

    // The service verifies the sessionToken and fetches the user securely behind the scenes
    const tokens = await authService.verifyOtp(
      sessionToken,
      req.body.otp,
      req.ip,
      req.headers['user-agent']
    );

    // Clear both cookies upon successful verification
    res.clearCookie('twoFactorSession', {
      path: `${appConfig.apiPrefix}/auth`,
    });
    res.clearCookie('twoFaUserId', {
      path: `${appConfig.apiPrefix}/auth`,
    });

    return sendAuthResponse(
      req,
      res,
      tokens,
      SUCCESS_CODES.OTP_VERIFIED
    );
  }
);

export const resendLoginOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies?.twoFactorSession;

    if (!sessionToken) {
      throw new AppError(ERROR_CODES.INVALID_OTP_SESSION);
    }

    // Process the resend (rate-limiting checks & sending email happen inside)
    await authService.resendLoginOtp(sessionToken);

    const currentUserId = req.cookies?.twoFaUserId;
    if (currentUserId) {
      res.cookie('twoFaUserId', currentUserId, {
        httpOnly: false,
        secure: appConfig.isProduction,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000, // Reset the 10-minute lifetime window
        path: `${appConfig.apiPrefix}/auth`,
      });
    }

    return sendSuccess(res, SUCCESS_CODES.OTP_RESENT);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token =
      req.body.refreshToken ?? req.cookies?.refreshToken;

    if (!token) {
      throw new AppError(ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    const newTokens = await authService.refreshTokens(
      token,
      req.ip,
      req.headers['user-agent']
    );

    return sendAuthResponse(
      req,
      res,
      newTokens,
      SUCCESS_CODES.TOKEN_REFRESHED
    );
  }
);

export const logout = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const token =
      req.body?.refreshToken ?? req.cookies?.refreshToken;

    await authService.logout(req.user!.sessionId, token);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return sendSuccess(
      res,
      SUCCESS_CODES.LOGOUT_SUCCESS
    );
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.body.email) {
      throw new AppError(ERROR_CODES.EMAIL_REQUIRED);
    }

    const result = await passwordAuthService.forgotPassword(
      req.body.email
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.PASSWORD_RESET_EMAIL_SENT,
      result
    );
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await passwordAuthService.resetPassword(
      req.body.token,
      req.body.newPassword
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.PASSWORD_RESET_SUCCESS,
      result
    );
  }
);

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await passwordAuthService.changePassword(
      req.user!.id,
      req.body
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.PASSWORD_CHANGED,
      result
    );
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }

    const user = await profileAuthService.getMe(req.user.id);

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (user.status === 'BANNED') {
      throw new AppError(ERROR_CODES.ACCOUNT_BANNED);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(ERROR_CODES.ACCOUNT_SUSPENDED);
    }

    return sendSuccess(
      res,
      SUCCESS_CODES.PROFILE_FETCHED,
      user
    );
  }
);

export const getUserAccountStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED); //[cite: 1]
    }

    // Call our newly created service function
    const statusReport = await profileAuthService.getUserAccountStatus(req.user.id);

    return sendSuccess(
      res,
      SUCCESS_CODES.PROFILE_FETCHED, // Or map a specific USER_STATUS_FETCHED code[cite: 1]
      statusReport
    );
  }
);
export const requestEnable2FA = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await twoFactorAuthService.requestEnable2FA(
      req.user!.id,
      req.body.password
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.TWO_FACTOR_OTP_SENT,
      result
    );
  }
);

export const verifyEnable2FA = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await twoFactorAuthService.verifyEnable2FA(
      req.user!.id,
      req.body.otp
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.TWO_FACTOR_ENABLED,
      result
    );
  }
);

export const requestDisable2FA = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await twoFactorAuthService.requestDisable2FA(
      req.user!.id,
      req.body.password
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.TWO_FACTOR_DISABLE_OTP_SENT,
      result
    );
  }
);

export const verifyDisable2FA = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await twoFactorAuthService.verifyDisable2FA(
      req.user!.id,
      req.body.otp
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.TWO_FACTOR_DISABLED,
      result
    );
  }
);

export const createAdmin = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const admin = await adminAuthService.createAdmin(
      req.body,
      req.user!.id
    );

    return sendSuccess(
      res,
      SUCCESS_CODES.ADMIN_USER_CREATED,
      admin
    );
  }
);