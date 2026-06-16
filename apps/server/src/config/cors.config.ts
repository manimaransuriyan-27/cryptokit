import type { CorsOptions } from 'cors';
import { env } from './env.config';

const allowedOrigins: string[] = [
  'http://localhost:5173', // Vite dev
  'http://localhost:3000', // fallback
  env.CLIENT_URL, // production URL from .env
].filter(Boolean); // remove undefined/empty values

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, Thunder Client, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`)); // 👈 line 16 area
    }
  },
  credentials: true, // required for httpOnly cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-mode', 'x-client-type'],
  exposedHeaders: ['set-cookie'],
};