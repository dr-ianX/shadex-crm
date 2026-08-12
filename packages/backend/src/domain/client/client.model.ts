/**
 * Modelo de entidad Client
 */

export interface ClientModel {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClientCreateInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}

export interface ClientUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}