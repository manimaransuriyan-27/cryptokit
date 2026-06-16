import crypto from 'crypto';

// ─── Secure random token (email verify / password reset) ──────────────────────

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

// ─── Hash a token before storing in DB (never store raw) ──────────────────────

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─── 6-digit numeric OTP ──────────────────────────────────────────────────────

export function generateOtp(): string {
  // cryptographically safe 6-digit OTP
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(6, '0');
}

// ─── Refresh token family ID ──────────────────────────────────────────────────

export function generateFamily(): string {
  return crypto.randomUUID();
}

// ─── Token expiry helpers ─────────────────────────────────────────────────────

export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
