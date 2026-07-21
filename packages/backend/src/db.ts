// Use the runtime helper to obtain a PrismaClient class configured by prisma.config.ts
// This avoids needing to directly import a driver adapter in this file.
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma
