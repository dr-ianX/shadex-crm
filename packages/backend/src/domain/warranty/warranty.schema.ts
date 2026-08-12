/**
 * Schema Prisma para la entidad Warranty (Garantía)
 */

export default `
model Warranty {
  id                 String      @id @default(cuid())
  transformation_id  String?
  client_id          String
  technology_id      String
  serial_number      String?
  start_date         DateTime    @map("start_date")
  end_date           DateTime    @map("end_date")
  status             WarrantyStatus @default("active")
  terms              String?
  notes              String?
  createdAt          DateTime    @default(now()) @map("created_at")
  updatedAt          DateTime    @updatedAt @map("updated_at")

  transformation     Transformation?   @relation(fields: [transformation_id], references: [id])
  client             Client            @relation(fields: [client_id], references: [id])
  technology         Technology        @relation(fields: [technology_id], references: [id])

  @@index([transformation_id])
  @@index([client_id])
  @@index([technology_id])
  @@index([status])

  @@map("warranty")
}
`;

export type WarrantyStatus = 'active' | 'expired' | 'voided';