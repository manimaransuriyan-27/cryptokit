// // src/prisma/client.ts
// // import 'dotenv/config';
// import { env } from '@/config/env.config';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import { PrismaClient } from '../generated/prisma/client';

// if (!env.DATABASE_URL) {
//   throw new Error(
//     '💥 DATABASE_URL is missing from your environment configuration.'
//   );
// }

// // Automatically break down the standard connection string
// const dbUri = new URL(env.DATABASE_URL);

// const adapter = new PrismaMariaDb({
//   host: dbUri.hostname || 'localhost',
//   user: dbUri.username || 'root',
//   // decodeURIComponent handles any special characters (@, #, !, etc.) in your password
//   password: decodeURIComponent(dbUri.password || ''),
//   database: dbUri.pathname.replace(/^\//, ''),
//   port: dbUri.port ? Number(dbUri.port) : 3306,
//   connectionLimit: 10,
// });

// export const prisma = new PrismaClient({ adapter });
