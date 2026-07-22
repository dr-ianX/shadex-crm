import { defineConfig } from "@prisma/config";
import path from 'path'

// Default to a local sqlite DB for developer convenience if DATABASE_URL is not set
const defaultDb = `file:${path.join(process.cwd(), 'packages', 'backend', 'prisma', 'dev.db')}`

export default defineConfig({
  // Root-level config for Prisma CLI to find the datasource URL and schema path
  datasource: {
    url: process.env.DATABASE_URL || defaultDb,
  },
  schema: "./packages/backend/prisma/schema.prisma",
});
