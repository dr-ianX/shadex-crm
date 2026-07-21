import { defineConfig } from "@prisma/config";

export default defineConfig({
  // Provide the datasource URL via environment variable. Prisma CLI will read this when running commands.
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // Optionally specify the schema path if different; default will find schema.prisma in this folder.
  // schema: "./schema.prisma",
});
