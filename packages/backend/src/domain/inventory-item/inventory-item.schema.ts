/**
 * Schema Prisma para la entidad InventoryItem (Ítem de Inventario)
 */

export default `
model InventoryItem {
  id            String           @id @default(cuid())
  name          String
  description   String?
  sku           String           @unique
  category      String
  quantity      Int              @default(0)
  unit_cost     Float
  current_value Float            @map("current_value")
  location      String?
  status        String
  createdAt     DateTime         @default(now()) @map("created_at")
  updatedAt     DateTime         @updatedAt @map("updated_at")

  @@index([sku])
  @@index([category])
  @@index([status])

  @@map("inventory_item")
}
`;