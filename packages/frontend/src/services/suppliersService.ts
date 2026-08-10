import axios from 'axios'
import { API_URL } from '../config'

const API_BASE = API_URL || 'http://localhost:3001'
axios.defaults.baseURL = API_BASE

export interface Supplier {
  id: string
  code: string
  name: string
  taxId?: string
  businessType: string
  contactPerson?: string
  email?: string
  phone?: string
  secondaryPhone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  paymentTerms?: string
  creditLimit?: number
  currentBalance: number
  discountPercentage: number
  leadTimeDays: number
  minimumOrder?: number
  status: string
  rating: number
  preferredLevel: string
  contractStartDate?: string
  contractEndDate?: string
  notes?: string
  portalEnabled: boolean
  portalUsername?: string
  portalLastLogin?: string
  portalPermissions?: string
  createdAt: string
  updatedAt: string
  technologies?: any[]
  inventoryItems?: any[]
  evaluations?: any[]
}

export const suppliersService = {
  async getAll(filters?: { status?: string; businessType?: string }): Promise<Supplier[]> {
    const token = localStorage.getItem('shadex_access')
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.businessType) params.append('businessType', filters.businessType)
    
    const response = await axios.get(`/api/v1/suppliers?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getById(id: string): Promise<Supplier> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async search(query: string): Promise<Supplier[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/suppliers/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async create(supplierData: Partial<Supplier>): Promise<Supplier> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.post('/api/v1/suppliers', supplierData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async update(id: string, supplierData: Partial<Supplier>): Promise<Supplier> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.put(`/api/v1/suppliers/${id}`, supplierData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async delete(id: string): Promise<Supplier> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.delete(`/api/v1/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async addEvaluation(id: string, evaluation: { rating: number; comments?: string; evaluatorId?: string }): Promise<any> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.post(`/api/v1/suppliers/${id}/evaluations`, evaluation, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  }
}