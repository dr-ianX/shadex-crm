/**
 * Schema Prisma para la entidad Space (Espacio/Física)
 */

export default `
model Space {
  id             String           @id @default(cuid())
  name           String
  description    String?
  address        String?
  floor          Int?
  area_sqm       Float?
  capacity       Int?
  status         String
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  @@index([status])
  @@index([name])

  @@map("space")
}
`;