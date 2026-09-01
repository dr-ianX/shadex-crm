import bcrypt from 'bcryptjs'
import prisma from '../db'

async function main() {
  const existing = await prisma.user.findFirst({ where: { email: 'admin@shadex.com' } })
  if (existing) {
    console.log('Admin user already exists')
    return
  }
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@shadex.com',
      password: hashed,
      role: 'ADMIN',
      isActive: true
    }
  })
  console.log('Admin user created: admin@shadex.com / admin123')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
