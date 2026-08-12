/**
 * Schema Prisma para la entidad Quotation (Cotización)
 */

export default `
model Quotation {
  id                    String           @id @default(cuid())
  transformation_id     String
  client_id             String?
  total_amount         Decimal          @db.Decimal(10, 2)
  currency              String
  status                String
  validity_days         Int?
  notes                 String?
  createdAt             DateTime        @default(now()) @map("created_at")
  updatedAt             DateTime        @updatedAt @map("updated_at")

  transformation        Transformation   @relation(fields: [transformation_id], references: [id])
  client                Client?          @relation(fields: [client_id], references: [id])

  @@index([transformation_id])
  @@index([client_id])
  @@index([status])

  @@map("quotation")
}
`;