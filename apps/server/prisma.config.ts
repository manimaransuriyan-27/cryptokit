
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // schema: './src/generated/prisma/schema.prisma', 
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'pnpm tsx ./src/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});




