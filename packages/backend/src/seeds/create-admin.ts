import bcrypt from 'bcryptjs'
import prisma from '../db'

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@shadex.com' },
    update: { password: hashed },
    create: {
      name: 'Admin',
      email: 'admin@shadex.com',
      password: hashed,
      role: 'ADMIN_GENERAL',
      isActive: true
    }
  })
  console.log(`Admin user ready: ${user.email} / admin123`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
