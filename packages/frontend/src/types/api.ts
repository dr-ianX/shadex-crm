export interface User {
  id: string
  email?: string
  name?: string
  role?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Quotation {
  id: string
  quotationNumber?: string
  status?: string
  subtotal?: number
  taxAmount?: number
  totalAmount?: number
  createdAt?: string
}

export interface Client {
  id: string
  code?: string
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface Transformation {
  id: string
  name?: string
  folioNumber?: string
}

export interface ClientFormData {
  id?: string
  code: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  clientType: string
  status: string
  notes: string
}
