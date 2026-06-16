import type { ErrorCodeValue, OnErrorValue, OnSuccessValue, SuccessCodeValue } from "./common";

export type InitiateRegistrationErrorKeys =
    | 'EMAIL_IN_USE'
    | 'REGISTRATION_RATE_LIMIT_EXCEEDED'
    | 'TOO_MANY_REGISTRATION_REQUESTS'
    | 'EMAIL_ALREADY_VERIFIED';

export type InitiateRegistrationSuccessKeys = 'REGISTRATION_INITIATED';

export type InitiateRegistrationErrorCode =
    ErrorCodeValue<InitiateRegistrationErrorKeys>;
export type InitiateRegistrationSuccessCode =
    SuccessCodeValue<InitiateRegistrationSuccessKeys>;

export type InitiateRegistrationErrorResponse =
    OnErrorValue<InitiateRegistrationErrorCode>;
export type InitiateRegistrationSuccessResponse = OnSuccessValue<
    InitiateRegistrationSuccessCode,
    { email: string }
>;

export type InitiateRegistrationResponse = InitiateRegistrationSuccessResponse;

export interface InitiateRegistrationCredentials {
    email: string;
}

export interface InitiateRegistrationErrorFeedbackState {
    code: InitiateRegistrationErrorKeys;
}

export interface InitiateRegistrationSuccessFeedbackState {
    code: InitiateRegistrationSuccessKeys;
    data?: {
        emailId: string;
    };
}

// --------------------

export type VerifyEmailErrorKeys =
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

export type VerifyEmailErrorResponse =
    OnErrorValue<VerifyEmailErrorCode>;
export type VerifyEmailSuccessResponse = OnSuccessValue<
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

export type VerifyEmailResponse = VerifyEmailSuccessResponse;

// -------------

type CompleteRegistrationErrorKeys =
    | 'LINK_EXPIRED'
    | 'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN'
    | 'PHONE_ALREADY_IN_USE'
    | 'REGISTRATION_ALREADY_COMPLETED'
    | 'USER_NOT_FOUND';

type CompleteRegistrationSuccessKeys = 'REGISTRATION_COMPLETED';

export type CompleteRegistrationErrorCode =
    ErrorCodeValue<CompleteRegistrationErrorKeys>;
export type CompleteRegistrationSuccessCode =
    SuccessCodeValue<CompleteRegistrationSuccessKeys>;

export type CompleteRegistrationErrorResponse =
    OnErrorValue<CompleteRegistrationErrorCode>;
export type CompleteRegistrationSuccessResponse =
    OnSuccessValue<CompleteRegistrationSuccessCode>;

export interface CompleteRegistrationCredentials {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export type CompleteRegistrationResponse = CompleteRegistrationSuccessResponse;

export type CompleteRegistrationErrorFeedbackState = {
    code: CompleteRegistrationErrorKeys;
};

export type CompleteRegistrationSuccessFeedbackState = {
    code: CompleteRegistrationSuccessKeys;
};

// ------------------------

export type ResumeCompletionErrorKeys =
    | 'USER_NOT_FOUND'
    | 'TOO_MANY_AUTH_REQUESTS';

export type ResumeCompletionSuccessKeys =
    'GET_COMPLETION_REGISTRATION_TOKEN';

export type ResumeCompletionErrorCode =
    ErrorCodeValue<ResumeCompletionErrorKeys>;
export type ResumeCompletionSuccessCode =
    SuccessCodeValue<ResumeCompletionSuccessKeys>;

export type ResumeCompletionErrorResponse =
    OnErrorValue<ResumeCompletionErrorCode>;

export type ResumeCompletionSuccessResponse = OnSuccessValue<
    ResumeCompletionSuccessCode,
    {
        completionToken: string;
    }
>;

export interface ResumeCompletionCredentials {
    email: string;
}

export type ResumeCompletionResponse =
    ResumeCompletionSuccessResponse;

export interface ResumeCompletionSuccessFeedbackState {
    code: ResumeCompletionSuccessKeys;
}

export interface ResumeCompletionErrorFeedbackState {
    code: ResumeCompletionErrorKeys;
}

// -------------------

export type GetCompletionStatusErrorKeys =
    | 'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN'
    | 'REGISTRATION_ALREADY_COMPLETED'
    | 'LINK_EXPIRED';

export type GetCompletionStatusSuccessKeys = 'COMPLETION_STATUS_VALID';

export type GetCompletionStatusErrorCode =
    ErrorCodeValue<GetCompletionStatusErrorKeys>;
export type GetCompletionStatusSuccessCode =
    SuccessCodeValue<GetCompletionStatusSuccessKeys>;

export type GetCompletionStatusErrorResponse =
    OnErrorValue<GetCompletionStatusErrorCode>;

export type GetCompletionStatusSuccessResponse =
    OnSuccessValue<GetCompletionStatusSuccessCode>;

export type GetCompletionStatusResponse = GetCompletionStatusSuccessResponse;

export type GetCompletionStatusErrorFeedbackState = {
    code: GetCompletionStatusErrorKeys;
};

