/**
 * Schema Prisma para la entidad Supplier (Proveedor)
 */

export default `
model Supplier {
  id            String           @id @default(cuid())
  name          String
  contact_name  String?
  email         String           @unique
  phone         String?
  address       String?
  website       String?
  status        String
  createdAt     DateTime         @default(now()) @map("created_at")
  updatedAt     DateTime         @updatedAt @map("updated_at")

  @@index([email])
  @@index([status])

  @@map("supplier")
}
`;