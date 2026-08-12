/**
 * Modelo de entidad InventoryMovement (Movimiento de Inventario)
 */

export interface InventoryMovementModel {
  id: string;
  inventory_item_id: string;
  quantity_change: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  reference_id?: string;
  reference_type?: 'transformation' | 'purchase' | 'sale' | 'return' | 'adjustment';
  notes?: string;
  created_by?: string;
  created_at: Date;
}

export interface InventoryMovementCreateInput {
  inventory_item_id: string;
  quantity_change: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  reference_id?: string;
  reference_type?: 'transformation' | 'purchase' | 'sale' | 'return' | 'adjustment';
  notes?: string;
  created_by?: string;
}

export interface InventoryMovementUpdateInput {
  quantity_change?: number;
  movement_type?: 'in' | 'out' | 'adjustment' | 'transfer';
  notes?: string;
}

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer';
export type ReferenceType = 'transformation' | 'purchase' | 'sale' | 'return' | 'adjustment';