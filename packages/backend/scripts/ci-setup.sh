#!/usr/bin/env bash
# Helper script used by CI to prepare backend in non-interactive environments
set -euo pipefail
cd "$(dirname "$0")/.."

# Ensure prisma client generated and schema applied using db push to avoid interactive migrate
npx prisma db push --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma

# Build
npm run build

# Seed (only if needed). Uncomment if seeds should run in CI.
# node dist/seeds/seed.js || true

echo "Backend prepared for CI"
