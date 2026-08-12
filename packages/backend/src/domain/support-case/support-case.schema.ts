/**
 * Schema Prisma para la entidad SupportCase (Caso de Soporte)
 */

export default `
model SupportCase {
  id                    String           @id @default(cuid())
  transformation_id     String?
  client_id             String
  user_id               String
  priority              SupportPriority  @default("medium")
  status                SupportStatus    @default("open")
  subject               String
  description           String
  category              String
  tags                  StringJson?      @db.StringJson
  sla_hours             Int?
  resolved_at           DateTime?        @map("resolved_at")
  createdAt             DateTime         @default(now()) @map("created_at")
  updatedAt             DateTime         @updatedAt @map("updated_at")

  transformation        Transformation?   @relation(fields: [transformation_id], references: [id])
  client                Client            @relation(fields: [client_id], references: [id])
  user                  User              @relation(fields: [user_id], references: [id])

  @@index([transformation_id])
  @@index([client_id])
  @@index([user_id])
  @@index([status])
  @@index([priority])

  @@map("support_case")
}
`;