DEPLOYMENT RUNBOOK - SHADEX OS

Purpose
-------
This runbook describes steps to deploy SHADEX OS backend and frontend, environment variables, database migration steps, hosting options (GoDaddy vs VPS/Docker), process managers (PM2/systemd/Docker), backup and rollback, and a pre-deploy checklist.

Important
---------
- Never store secrets in the repository. Use your host's environment variables/secret manager.
- For production use PostgreSQL. The repo contains development helpers but production must use DATABASE_URL pointing to managed Postgres.

Environment variables (minimum)
-------------------------------
- DATABASE_URL: postgres://USER:PASS@HOST:5432/DBNAME?schema=public
- PORT: backend port (e.g., 3001)
- NODE_ENV: production
- JWT_SECRET: long random string for signing access tokens
- JWT_EXPIRES_IN: access token TTL (e.g., 15m)
- REFRESH_TOKEN_SECRET: long random string for refresh tokens
- REFRESH_TOKEN_EXPIRES_IN: refresh TTL (e.g., 7d)
- CORS_ORIGIN: frontend URL

Database (Prisma + Postgres)
----------------------------
Development:
- The repository ships with docker-compose for a local Postgres instance. Use docker-compose up -d postgres to start.

Production:
- Use a managed Postgres service (RDS, DigitalOcean Managed DB, ElephantSQL) or a dedicated Postgres server.
- Set DATABASE_URL in your production environment.

Running migrations:
- For production use: npx prisma migrate deploy --schema ./packages/backend/prisma/schema.prisma
- For development only: npx prisma migrate dev --schema ./packages/backend/prisma/schema.prisma
Notes: migrate dev will modify the database and is not suitable for production.

Generate client:
- npx prisma generate --schema ./packages/backend/prisma/schema.prisma

Backend build and start
-----------------------
1. Install dependencies: npm ci
2. Build: npm run build:backend (from repo root)
3. Start in production mode:
   - With PM2:
     pm2 start ./packages/backend/dist/index.js --name shadex-backend --env production
   - With systemd (example service):
     Create /etc/systemd/system/shadex-backend.service with ExecStart=/usr/bin/node /path/to/repo/packages/backend/dist/index.js and appropriate environment; then systemctl enable/start shadex-backend
   - With Docker: build container and run with DATABASE_URL env var

Frontend build and serve
------------------------
- Build static assets: npm run build:frontend
- Serve static files:
  - Serve via Nginx: copy packages/frontend/dist to server and configure nginx to serve static content
  - Or use GoDaddy static hosting to serve the frontend build (upload dist folder)

Hosting recommendations (GoDaddy vs VPS/Docker)
----------------------------------------------
- GoDaddy shared hosting is not ideal for a Node + Postgres stack. Recommended approaches:
  1) VPS with Docker (recommended): host frontend via Nginx container, backend via Node container, and Postgres via managed DB or container. Easier to manage and replicate locally.
  2) GoDaddy + VPS hybrid: host static frontend on GoDaddy and run backend on a separate VPS or cloud provider.
  3) Platform-as-a-Service: render.com, fly.io, or DigitalOcean App Platform provide easier deployments and managed Postgres.

Docker option (recommended for production/staging):
- Build images:
  docker build -t shadex-backend -f Dockerfile .
  docker build -t shadex-frontend -f packages/frontend/Dockerfile . (if exists)
- Use docker-compose with production env file (ensure DATABASE_URL points to managed Postgres)

Process management
------------------
- PM2: good for Node processes; supports zero-downtime reloads and logs. Use pm2 startup to generate startup scripts.
- systemd: robust for servers managed by root and supervisor.
- Docker: prefer container orchestration (docker-compose, swarm, k8s) for production deployments.

Backup and rollback
-------------------
- Backup Postgres before migrations or deploy:
  pg_dump -U user -h host -Fc dbname > backup-YYYYMMDD.dump
- To rollback schema, restore the backup and re-deploy previous application version.
- Store backups offsite and rotate daily/weekly depending on data criticality.

Checklist before deploy
-----------------------
- Verify environment variables present and correct (DATABASE_URL, JWT secrets).
- Run CI pipeline (lint, build, smoke tests).
- Take DB backup if deploying to non-empty database.
- Ensure migrations planned and reviewed.
- Confirm CORS_ORIGIN matches frontend domain.
- Validate SSL certificate and DNS entries.

Post-deploy verification
------------------------
- Check /health endpoint on backend
- Login with known seeded account or test account
- Access a protected endpoint
- Check logs (PM2 logs or systemd journal)

Secrets management
------------------
- Use your hosting provider's secret store or environment variables set in systemd/PM2/Docker.
- Rotate JWT secrets carefully: rotating REFRESH_TOKEN_SECRET will invalidate refresh tokens and may require forcing logout or using a migration strategy to re-issue refresh tokens.

Notes specific to refresh tokens and JWT
---------------------------------------
- Access tokens should be short-lived (e.g., 15m).
- Refresh tokens should be long-lived and stored hashed in DB.
- On rotation, revoke the used refresh token and persist replacedById.
- Support logout to revoke a refresh token.

Contact / Support
-----------------
For questions about production deployment options or to review runbook steps, contact the maintainer listed in the repository.
