/**
 * Modelo de entidad Quotation (Cotización)
 */

export interface QuotationModel {
  id: string;
  transformation_id: string;
  client_id?: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validity_days?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface QuotationCreateInput {
  transformation_id: string;
  client_id?: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validity_days?: number;
  notes?: string;
}

export interface QuotationUpdateInput {
  total_amount?: number;
  currency?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validity_days?: number;
  notes?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';