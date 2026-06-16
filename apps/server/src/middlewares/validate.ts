import type { ZodSchema } from 'zod';
import { AppError } from '@/errors/app-error';
import { ERROR_CODES, ERROR_REGISTRY } from "@repo/utils";
import type { NextFunction, Request, Response } from 'express';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // 💡 Passing the error directly to next() alerts Express's global handler
      return next(
        new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          `${ERROR_REGISTRY[ERROR_CODES.VALIDATION_ERROR]}: ${JSON.stringify(result.error.flatten().fieldErrors)}`
        )
      );
    }

    // ✅ Clean enhancement: Overwrite req.body with Zod's parsed and stripped data.
    // This strips out any malicious/unsupported keys injected into the payload!
    req.body = result.data;

    // Proceed seamlessly to your controller logic
    next();
  };
};
