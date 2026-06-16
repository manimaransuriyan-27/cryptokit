import type { ErrorCodeValue, OnErrorValue, OnSuccessValue, SuccessCodeValue } from "./common";

type Get2FASessionStatusErrorKeys = 'INVALID_OTP_SESSION';
type Get2FASessionStatusSuccessKeys = 'OTP_SESSION_VALID';

export type Get2FASessionStatusErrorCode =
    ErrorCodeValue<Get2FASessionStatusErrorKeys>;
export type Get2FASessionStatusSuccessCode =
    SuccessCodeValue<Get2FASessionStatusSuccessKeys>;

export type Get2FASessionStatusError =
    OnErrorValue<Get2FASessionStatusErrorCode>;

export type Get2FASessionStatusSuccess = OnSuccessValue<
    Get2FASessionStatusSuccessCode,
    {
        email: string;
    }
>;

export type Get2FASessionStatusApiResponse = Get2FASessionStatusSuccess;