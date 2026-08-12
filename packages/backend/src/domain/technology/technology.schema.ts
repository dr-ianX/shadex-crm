/**
 * Schema Prisma para la entidad Technology
 */

export default `
model Technology {
  id              String           @id @default(cuid())
  name            String
  description     String?
  category        String
  manufacturer    String?
  model           String?
  serial_number   String?          @map("serial_number")
  asset_tag       String?          @map("asset_tag")
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  @@unique([name, model])
  @@index([category])
  @@index([manufacturer])

  @@map("technology")
}
`;