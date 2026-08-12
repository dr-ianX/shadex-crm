/**
 * Schema Prisma para la entidad Task (Tarea)
 */

export default `
model Task {
  id             String           @id @default(cuid())
  title          String
  description    String?
  status         String
  priority       String
  due_date       DateTime?
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  @@index([status])
  @@index([priority])
  @@index([due_date])

  @@map("task")
}
`;