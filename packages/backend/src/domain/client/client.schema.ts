/**
 * Schema Prisma para la entidad Client
 */

export default `
model Client {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  company   String?
  address   String?
  notes     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("client")
}
`;