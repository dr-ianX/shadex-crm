/**
 * Modelo de entidad Technology
 */

export interface TechnologyModel {
  id: string;
  name: string;
  description?: string;
  category: 'hardware' | 'software' | 'infrastructure' | 'other';
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TechnologyCreateInput {
  name: string;
  description?: string;
  category: 'hardware' | 'software' | 'infrastructure' | 'other';
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
}

export interface TechnologyUpdateInput {
  name?: string;
  description?: string;
  category?: 'hardware' | 'software' | 'infrastructure' | 'other';
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
}

export type TechnologyCategory = 'hardware' | 'software' | 'infrastructure' | 'other';