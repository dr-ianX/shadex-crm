/**
 * Schema Prisma para la entidad Transformation
 */

export default `
model Transformation {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default(PLANNING)
  clientId    String   @map("client_id")
  location    String
  areaSqm     Float    @map("area_sqm")
  startDate   DateTime @map("start_date")
  endDate     DateTime? @map("end_date")
  budget      Float    @map("budget")
  architect   String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("transformation")
}
`;