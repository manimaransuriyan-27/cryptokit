import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { appConfig } from '@/config/app.config';
import { corsOptions } from '@/config/cors.config';
import { helmetConfig } from '@/config/helmet.config';
import { requestLogger } from '@/middlewares/logger';
import { notFoundHandler } from '@/middlewares/not-found';
import { addSecurityHeaders, sanitizeData } from '@/middlewares/security';
import { apiLimiter } from '@/utils/limiter.util';

import router from '@/routes/app.routes';
import { globalErrorHandler } from './middlewares/global-error';


const app: Application = express();

// ==================== TRUST PROXY ====================
// Must be set before any middleware that reads req.ip (rate limiter, logger, auth)
if (appConfig.isProduction) {
  app.set('trust proxy', 1);
}
 
// ==================== SECURITY HEADERS ====================
app.use(helmet(helmetConfig));
app.use(addSecurityHeaders);
 
// ==================== CORS ====================
// OPTIONS preflight must be registered BEFORE the body parsers and rate limiter
// so browsers don't get rate-limited on preflight requests
app.use(cors(corsOptions));
app.options('/{*splat}', cors(corsOptions)); // Express 5: wildcards must be named
 
// ==================== REQUEST LOGGING ====================
// Placed early so every incoming request (including bad ones) gets logged
app.use(requestLogger);
 
// ==================== RATE LIMITING ====================
app.use(appConfig.apiPrefix, apiLimiter);
 
// ==================== BODY PARSERS ====================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
 
// ==================== COOKIE PARSER ====================
app.use(cookieParser());
 
// ==================== DATA SANITISATION ====================
// Prevent NoSQL injection (mongo-sanitize / equivalent)
app.use(sanitizeData);
 
// ==================== HTTP PARAMETER POLLUTION ====================
app.use(
  hpp({
    whitelist: ['sort', 'fields', 'page', 'limit', 'filter'],
  })
);
 
// ==================== COMPRESSION ====================
// Must come after body parsing — compresses the outgoing response body
app.use(compression());
 
// ==================== HEALTH CHECK ====================
// Intentionally NOT behind apiPrefix or rate limiter —
// infrastructure / load balancers probe this endpoint freely
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: appConfig.env,
  });
});
 
// ==================== API ROUTES ====================
app.use(appConfig.apiPrefix, router);
 
// ==================== ERROR HANDLERS ====================
// Order matters: notFoundHandler catches unmatched routes first,
// then errorMiddleware handles AppErrors / uncaught throws from routes
app.use(notFoundHandler);
app.use(globalErrorHandler);
 
export default app;

