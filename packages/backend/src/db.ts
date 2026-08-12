// Use the runtime helper to obtain a PrismaClient class configured by prisma.config.ts
// Instantiate PrismaClient with a driver adapter only when the Prisma schema provider requires it.
// Use require for Prisma client to be resilient to differing package export layouts across versions
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')
import fs from 'fs'
import path from 'path'

let prisma: any

// Inspect the schema to determine the provider. This prevents adapter/provider mismatches
try {
  // Try multiple locations for schema.prisma depending on current working dir
  const candidates = [
    path.join(process.cwd(), 'prisma', 'schema.prisma'),
    path.join(process.cwd(), 'packages', 'backend', 'prisma', 'schema.prisma'),
    path.join(__dirname, '..', 'prisma', 'schema.prisma'),
    path.join(__dirname, '..', '..', 'prisma', 'schema.prisma')
  ]
  const schemaPath = candidates.find(p => fs.existsSync(p))
  if (!schemaPath) throw new Error('Could not locate prisma schema.prisma in expected locations: ' + candidates.join(', '))
  const schema = fs.readFileSync(schemaPath, 'utf8')
  const match = /datasource\s+\w+\s+{[^}]*provider\s*=\s*"([^"]+)"/s.exec(schema)
  const provider = match ? match[1] : undefined

  if (provider === 'postgresql' || provider === 'postgres') {
    // For Postgres provider, use direct connection without adapter (Prisma 4.x doesn't support adapter param)
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/shadex_os'
    prisma = new PrismaClient({ 
      datasourceUrl: connectionString,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  } else {
    // For sqlite and other providers, use default client
    prisma = new PrismaClient()
  }
} catch (err) {
  // If anything goes wrong reading schema, fallback to default client to avoid startup crash
  prisma = new PrismaClient()
}

export default prisma
