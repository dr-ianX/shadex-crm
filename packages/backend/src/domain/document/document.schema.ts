/**
 * Schema Prisma para la entidad Document
 */

export default `
model Document {
  id              String           @id @default(cuid())
  name            String
  type            String
  description     String?
  file_path       String?          @map("file_path")
  file_url        String?          @map("file_url")
  version         Int              @default(1)
  status          String
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  @@unique([name, type])
  @@index([status])

  @@map("document")
}
`;