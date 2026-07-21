import { defineConfig } from "@prisma/config";

export default defineConfig({
  // Root-level config for Prisma CLI to find the datasource URL and schema path
  datasource: {
    url: process.env.DATABASE_URL,
  },
  schema: "./packages/backend/prisma/schema.prisma",
});
