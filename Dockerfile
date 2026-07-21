# SHADEX OS - Multi-stage Docker Build

# Stage 1: Backend
FROM node:22-bullseye-slim AS backend
WORKDIR /app

# Install OS-level dependencies required by Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy backend package files
COPY packages/backend/package*.json ./packages/backend/
COPY package.json ./

# Install backend dependencies
RUN cd packages/backend && npm install

# Copy backend source
COPY packages/backend ./packages/backend

# Build backend
RUN cd packages/backend && npm run build

# Stage 2: Frontend
FROM node:22-bullseye-slim AS frontend
WORKDIR /app

# Copy frontend package files
COPY packages/frontend/package*.json ./packages/frontend/
COPY package.json ./

# Install frontend dependencies
RUN cd packages/frontend && npm install --legacy-peer-deps

# Copy frontend source
COPY packages/frontend ./packages/frontend

# Build frontend
RUN cd packages/frontend && npm run build

# Stage 3: Production
FROM node:22-bullseye-slim
WORKDIR /app

# Install OS-level dependencies required by Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install production dependencies
COPY packages/backend/package*.json ./packages/backend/
COPY package.json ./
RUN cd packages/backend && npm install --omit=dev

# Copy built backend
COPY --from=backend /app/packages/backend/dist ./packages/backend/dist
COPY --from=backend /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=backend /app/packages/backend/node_modules ./packages/backend/node_modules

# Copy built frontend
COPY --from=frontend /app/packages/frontend/dist ./packages/frontend/dist

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "packages/backend/dist/index.js"]