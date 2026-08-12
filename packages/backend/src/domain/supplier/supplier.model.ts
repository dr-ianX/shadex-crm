/**
 * Modelo de entidad Supplier (Proveedor)
 */

export interface SupplierModel {
  id: string;
  name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface SupplierCreateInput {
  name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface SupplierUpdateInput {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status?: 'active' | 'inactive';
}

export type SupplierStatus = 'active' | 'inactive';