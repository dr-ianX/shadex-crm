/**
 * Modelo de entidad Transformation
 */

export interface TransformationModel {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  client_id: string;
  location: string;
  area_sqm: number;
  start_date: Date;
  end_date?: Date;
  budget: number;
  architect?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransformationCreateInput {
  name: string;
  description?: string;
  client_id: string;
  location: string;
  area_sqm: number;
  start_date: Date;
  end_date?: Date;
  budget: number;
  architect?: string;
}

export interface TransformationUpdateInput {
  name?: string;
  description?: string;
  status?: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  area_sqm?: number;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  architect?: string;
}

export type TransformationStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';