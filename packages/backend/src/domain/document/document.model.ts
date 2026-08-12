/**
 * Modelo de entidad Document
 */

export interface DocumentModel {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'specification' | 'certificate' | 'other';
  description?: string;
  file_path?: string;
  file_url?: string;
  version?: number;
  status: 'draft' | 'approved' | 'signed' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface DocumentCreateInput {
  name: string;
  type: 'contract' | 'invoice' | 'specification' | 'certificate' | 'other';
  description?: string;
  file_path?: string;
  file_url?: string;
  version?: number;
}

export interface DocumentUpdateInput {
  name?: string;
  type?: 'contract' | 'invoice' | 'specification' | 'certificate' | 'other';
  description?: string;
  file_path?: string;
  file_url?: string;
  version?: number;
}

export type DocumentType = 'contract' | 'invoice' | 'specification' | 'certificate' | 'other';
export type DocumentStatus = 'draft' | 'approved' | 'signed' | 'archived';