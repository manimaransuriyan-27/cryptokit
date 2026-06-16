import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@repo/utils";

export function assertAccountIsActive(user: {
  status: string;
  lockedUntil: Date | null;
}) {
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(ERROR_CODES.ACCOUNT_LOCKED).withMeta({
      lockoutMinutes: mins,
      message: `Account locked. Try again in ${Math.max(1, mins)} minutes.`,
    });
  }
  if (user.status === 'BANNED') throw new AppError(ERROR_CODES.ACCOUNT_BANNED);
  if (user.status === 'SUSPENDED') throw new AppError(ERROR_CODES.ACCOUNT_SUSPENDED);
}