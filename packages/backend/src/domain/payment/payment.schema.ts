/**
 * Schema Prisma para la entidad Payment (Pago)
 */

export default `
model Payment {
  id                    String           @id @default(cuid())
  transformation_id     String
  amount                Decimal          @db.Decimal(10, 2)
  currency              String
  method                String
  status                String
  reference_number      String?
  notes                 String?
  createdAt             DateTime         @default(now()) @map("created_at")
  updatedAt             DateTime         @updatedAt @map("updated_at")

  transformation        Transformation   @relation(fields: [transformation_id], references: [id])

  @@index([transformation_id])
  @@index([status])
  @@index([method])

  @@map("payment")
}
`;