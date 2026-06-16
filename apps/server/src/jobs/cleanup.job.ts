import cron from 'node-cron';
import { prisma } from '@/prisma/client';
import { logger } from '@/utils/logger.util';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CleanupResult {
  success: boolean;
  ranAt: string;
  triggeredBy: 'cron' | 'manual';
  deleted: {
    expiredTokens: number;
    expiredOrRevokedRefreshTokens: number;
    deadSessions: number;
  };
  error?: string;
}

// ─── Core Cleanup Logic ───────────────────────────────────────────────────────

/**
 * Executes a hard purge on expired authentication data structures.
 * Returns a structured result object — usable by both cron and manual triggers.
 */
async function runCleanup(
  triggeredBy: 'cron' | 'manual'
): Promise<CleanupResult> {
  const now = new Date();
  const ranAt = now.toISOString();

  logger.info(`[CLEANUP JOB]: Starting database maintenance — triggered by: ${triggeredBy}`);

  try {
    const [deletedTokens, deletedRefreshTokens, deletedSessions] =
      await Promise.all([
        // 1. Purge expired verification links, 2FA OTP codes, and password reset tokens
        prisma.token.deleteMany({
          where: {
            expiresAt: { lt: now },
          },
        }),

        // 2. Purge refresh tokens that are expired OR revoked more than 7 days ago
        // The 7-day grace window preserves revoked tokens for short-term audit tracing
        prisma.refreshToken.deleteMany({
          where: {
            OR: [
              { expiresAt: { lt: now } },
              {
                isRevoked: true,
                revokedAt: {
                  lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            ],
          },
        }),

        // 3. Purge sessions that are both expired AND explicitly inactive
        // (active sessions are preserved even if past expiry — let refresh token rotation handle them)
        prisma.session.deleteMany({
          where: {
            expiresAt: { lt: now },
            isActive: false,
          },
        }),
      ]);

    const result: CleanupResult = {
      success: true,
      ranAt,
      triggeredBy,
      deleted: {
        expiredTokens: deletedTokens.count,
        expiredOrRevokedRefreshTokens: deletedRefreshTokens.count,
        deadSessions: deletedSessions.count,
      },
    };

    logger.info('[CLEANUP JOB]: Maintenance complete', result);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[CLEANUP JOB]: Database cleanup failed', { error: message });

    return {
      success: false,
      ranAt,
      triggeredBy,
      deleted: {
        expiredTokens: 0,
        expiredOrRevokedRefreshTokens: 0,
        deadSessions: 0,
      },
      error: message,
    };
  }
}

// ─── Public: Cron-Scheduled Trigger ──────────────────────────────────────────

/**
 * Called internally by the cron scheduler.
 * @internal
 */
export async function executeDatabaseCleanup(): Promise<void> {
  await runCleanup('cron');
}

// ─── Public: Manual Trigger ───────────────────────────────────────────────────

/**
 * Trigger the cleanup manually from an admin route or a one-off script.
 *
 * Usage in a route handler:
 * ```ts
 * import { triggerManualCleanup } from '@/jobs/cleanup.job';
 *
 * export const runCleanupNow = asyncHandler(async (_req, res) => {
 *   const result = await triggerManualCleanup();
 *   res.status(result.success ? 200 : 500).json(result);
 * });
 * ```
 */
export async function triggerManualCleanup(): Promise<CleanupResult> {
  return runCleanup('manual');
}

// ─── Scheduler Init ───────────────────────────────────────────────────────────

/**
 * Initializes and arms all background cron tasks.
 * Call once during application bootstrap in server.ts.
 */
export function initBackgroundJobs(): void {
  // Runs once daily at 12:00 AM midnight server time
  cron.schedule('0 0 * * *', async () => {
    await executeDatabaseCleanup();
  });

  logger.info('[BACKGROUND WORKER]: Cron schedulers armed and active.');
}