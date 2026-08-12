/**
 * Modelo de entidad Space (Espacio/Física)
 */

export interface SpaceModel {
  id: string;
  name: string;
  description?: string;
  address?: string;
  floor?: number;
  area_sqm?: number;
  capacity?: number;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: Date;
  updated_at: Date;
}

export interface SpaceCreateInput {
  name: string;
  description?: string;
  address?: string;
  floor?: number;
  area_sqm?: number;
  capacity?: number;
}

export interface SpaceUpdateInput {
  name?: string;
  description?: string;
  address?: string;
  floor?: number;
  area_sqm?: number;
  capacity?: number;
  status?: 'available' | 'occupied' | 'maintenance';
}

export type SpaceStatus = 'available' | 'occupied' | 'maintenance';