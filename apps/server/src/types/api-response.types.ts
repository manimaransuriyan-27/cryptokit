export interface ApiSuccessResponse<T = unknown> {
  success: true;
  code: string;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;