import type { ErrorCodeValue, OnErrorValue, OnSuccessValue, SuccessCodeValue } from "./common";

type VerifyEmailErrorKeys =
    | 'LINK_ALREADY_USED'
    | 'INVALID_VERIFICATION_LINK'
    | 'RESUME_REGISTRATION_COMPLETION'
    | 'TOO_MANY_AUTH_REQUESTS'
    | 'REGISTRATION_ALREADY_COMPLETED'
    | 'LINK_EXPIRED';

type VerifyEmailSuccessKeys = 'EMAIL_VERIFIED';

export type VerifyEmailErrorCode =
    ErrorCodeValue<VerifyEmailErrorKeys>;
export type VerifyEmailSuccessCode =
    SuccessCodeValue<VerifyEmailSuccessKeys>;

export type VerifyEmailError =
    OnErrorValue<VerifyEmailErrorCode>;
export type VerifyEmailSuccess = OnSuccessValue<
    VerifyEmailSuccessCode,
    {
        completionToken: string;
    }
>;

export interface VerifyEmailCredentials {
    token: string;
}

export interface VerifyEmailErrorFeedbackState {
    code: VerifyEmailErrorKeys;
    data?: {
        emailId: string;
    };
}
export interface VerifyEmailSuccessFeedbackState {
    code: VerifyEmailSuccessKeys;
}

export type VerifyEmailApiResponse = VerifyEmailSuccess;
