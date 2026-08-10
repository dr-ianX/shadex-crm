This folder is intended to hold generated SQL migration scripts for review and version control.

Why this folder may be empty:
- Running `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script -o 0001_init.sql` in this environment produced an empty output file. This can happen when the CLI cannot determine a datasource or when the runtime environment handles stdout differently.

How to generate a proper SQL migration locally (recommended):
1. Ensure you have Node.js and the exact Prisma version used by the project installed (see package.json).
2. In packages/backend, run:

   npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script -o prisma/migrations_generated/0001_init.sql

   This will create a SQL script that creates the tables defined in prisma/schema.prisma.

3. Inspect the generated SQL carefully, then commit it into this folder.

Notes:
- Do NOT run `prisma migrate dev` against production without backup. `prisma migrate dev` applies migrations to the configured database.
- If you want me to attempt the interactive migrate dev (which applies changes), provide a reachable DATABASE_URL or confirm the .env DATABASE_URL.
