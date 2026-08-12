/**
 * Modelo de entidad InventoryItem (Ítem de Inventario)
 */

export interface InventoryItemModel {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  quantity: number;
  unit_cost: number;
  current_value: number;
  location?: string;
  status: 'active' | 'inactive' | 'reserved' | 'damaged';
  created_at: Date;
  updated_at: Date;
}

export interface InventoryItemCreateInput {
  name: string;
  description?: string;
  sku: string;
  category: string;
  quantity: number;
  unit_cost: number;
  location?: string;
}

export interface InventoryItemUpdateInput {
  name?: string;
  description?: string;
  quantity?: number;
  unit_cost?: number;
  location?: string;
  status?: 'active' | 'inactive' | 'reserved' | 'damaged';
}

export type InventoryItemStatus = 'active' | 'inactive' | 'reserved' | 'damaged';