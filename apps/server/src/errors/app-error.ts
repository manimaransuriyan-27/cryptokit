import { ERROR_REGISTRY, type ErrorCode } from "@repo/utils"

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public meta?: Record<string, any>;

  constructor(code: ErrorCode, overrideMessage?: string) {
    const registryEntry = ERROR_REGISTRY[code];

    // Fallback safely if a code isn't mapped in the registry
    const message = overrideMessage || registryEntry?.message || 'An unexpected error occurred.';
    const statusCode = registryEntry?.statusCode || 500;

    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
  withMeta(meta: Record<string, any>): this {
    this.meta = meta;
    return this;
  }
}