/**
 * Schema Prisma para la entidad User (Usuario)
 */

export default `
model User {
  id             String           @id @default(cuid())
  username       String
  email          String           @unique
  password_hash  String?
  role           String
  department     String?
  status         String
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  @@index([email])
  @@index([role])
  @@index([status])

  @@map("user")
}
`;