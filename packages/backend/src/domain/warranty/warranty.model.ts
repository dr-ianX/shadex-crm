/**
 * Modelo de entidad Warranty (Garantía)
 */

export interface WarrantyModel {
  id: string;
  transformation_id?: string;
  client_id: string;
  technology_id: string;
  serial_number?: string;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'expired' | 'voided';
  terms?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WarrantyCreateInput {
  transformation_id?: string;
  client_id: string;
  technology_id: string;
  serial_number?: string;
  start_date: Date;
  end_date: Date;
  terms?: string;
  notes?: string;
}

export interface WarrantyUpdateInput {
  status?: 'active' | 'expired' | 'voided';
  terms?: string;
  notes?: string;
}

export type WarrantyStatus = 'active' | 'expired' | 'voided';