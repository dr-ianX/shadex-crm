/**
 * Modelo de entidad SupportCase (Caso de Soporte)
 */

export interface SupportCaseModel {
  id: string;
  transformation_id?: string;
  client_id: string;
  user_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  category: string;
  tags?: string[];
  sla_hours?: number;
  resolved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SupportCaseCreateInput {
  transformation_id?: string;
  client_id: string;
  user_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  category: string;
  tags?: string[];
  sla_hours?: number;
}

export interface SupportCaseUpdateInput {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolved_at?: Date;
  tags?: string[];
  sla_hours?: number;
}

export type SupportCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportCasePriority = 'low' | 'medium' | 'high' | 'critical';