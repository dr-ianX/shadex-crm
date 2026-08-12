/**
 * Schema Prisma para la entidad InventoryMovement (Movimiento de Inventario)
 */

export default `
model InventoryMovement {
  id                    String           @id @default(cuid())
  inventory_item_id     String
  quantity_change       Int
  movement_type         MovementType
  reference_id          String?
  reference_type        ReferenceType?
  notes                 String?
  created_by            String?
  createdAt             DateTime         @default(now()) @map("created_at")
  updatedAt             DateTime         @updatedAt @map("updated_at")

  inventoryItem         InventoryItem    @relation(fields: [inventory_item_id], references: [id])

  @@index([inventory_item_id])
  @@index([movement_type])
  @@index([reference_id, reference_type])

  @@map("inventory_movement")
}
`;

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer';
export type ReferenceType = 'transformation' | 'purchase' | 'sale' | 'return' | 'adjustment';