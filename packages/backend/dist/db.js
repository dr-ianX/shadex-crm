"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Use the runtime helper to obtain a PrismaClient class configured by prisma.config.ts
// This avoids needing to directly import a driver adapter in this file.
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=db.js.map