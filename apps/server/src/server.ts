// src/server.ts
import type { Server } from 'http';
import app from './app';
import { prisma } from '@/prisma/client';
import { env } from '@/config/env.config';
import { initBackgroundJobs, triggerManualCleanup } from '@/jobs/cleanup.job';
import { logger } from '@/utils/logger.util';
import { toLogMeta } from '@/utils/error.util';

const { PORT } = env;

// How long to wait for in-flight requests to finish before forcing shutdown
const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 10_000;

let server: Server;

// ==================== BOOTSTRAP ====================

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Database infrastructure connectivity verified successfully');

    initBackgroundJobs();

    // Run an immediate cleanup pass on production startup to purge any stale
    // data that accumulated while the server was offline (e.g. after a redeploy).
    // Uses triggerManualCleanup so the result is logged in structured format.
    if (env.NODE_ENV === 'production') {
      const result = await triggerManualCleanup();
      if (!result.success) {
        // Non-fatal — log the failure but do not abort startup
        logger.warn(
          '[STARTUP CLEANUP]: Initial cleanup pass failed, continuing bootstrap',
          {
            error: result.error,
          }
        );
      }
    }

    server = app.listen(PORT, () => {
      logger.info(`Authentication Engine live on port ${PORT}`);
    });
  } catch (error) {
    logger.error(
      'Failed to initialize application bootstrap layer',
      toLogMeta(error)
    );
    process.exit(1);
  }
}

// ==================== GRACEFUL SHUTDOWN ====================

async function handleGracefulShutdown(signal: string) {
  logger.warn(
    `[${signal}] signal intercepted. Initiating graceful shutdown...`
  );

  // Force-kill if shutdown takes longer than the timeout.
  // Without this, a stuck keep-alive connection can hang the process indefinitely.
  const forceKillTimer = setTimeout(() => {
    logger.error(
      '[SHUTDOWN]: Graceful shutdown timed out. Forcing process exit.'
    );
    process.exit(1);
  }, GRACEFUL_SHUTDOWN_TIMEOUT_MS);

  // Prevent the timer itself from keeping the event loop alive
  forceKillTimer.unref();

  if (server) {
    server.close(async () => {
      logger.info('HTTP listener closed — no new connections accepted.');
      try {
        await prisma.$disconnect();
        logger.info('Prisma connection pools drained cleanly.');
        clearTimeout(forceKillTimer);
        process.exit(0);
      } catch (error) {
        logger.error(
          'Error while disconnecting database client',
          toLogMeta(error)
        );
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
}

// ==================== PROCESS SIGNAL HANDLERS ====================

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Catches unhandled promise rejections (e.g. a floating async call with no .catch())
process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;
  logger.error({ event: 'unhandledRejection', message, stack });
  process.exit(1);
});

// Catches synchronous exceptions that escaped all try/catch blocks
process.on('uncaughtException', (error: Error) => {
  logger.error({
    event: 'uncaughtException',
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// ==================== START ====================

bootstrap();
