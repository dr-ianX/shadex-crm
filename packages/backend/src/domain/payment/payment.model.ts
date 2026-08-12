/**
 * Modelo de entidad Payment (Pago)
 */

export interface PaymentModel {
  id: string;
  transformation_id: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'check';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentCreateInput {
  transformation_id: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'check';
  reference_number?: string;
  notes?: string;
}

export interface PaymentUpdateInput {
  amount?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number?: string;
  notes?: string;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'check';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';