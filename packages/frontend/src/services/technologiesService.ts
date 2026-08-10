import axios from 'axios'
import { API_URL } from '../config'

const API_BASE = API_URL || 'http://localhost:3001'
axios.defaults.baseURL = API_BASE

export interface Technology {
  id: string
  code: string
  name: string
  description?: string
  category: string
  subcategory?: string
  applicationType?: string
  costPrice: number
  salePrice: number
  unitOfMeasure: string
  marginPercentage: number
  minimumOrder?: number
  manufacturer?: string
  model?: string
  specs?: string
  performanceFactors?: string
  status: string
  stockLevel: number
  reorderPoint: number
  leadTimeDays: number
  supplierId?: string
  notes?: string
  createdAt: string
  updatedAt: string
  supplier?: any
  inventoryItems?: any[]
  priceHistory?: any[]
}

export const technologiesService = {
  async getAll(filters?: { category?: string; status?: string }): Promise<Technology[]> {
    const token = localStorage.getItem('shadex_access')
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.status) params.append('status', filters.status)
    
    const response = await axios.get(`/api/v1/technologies?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getById(id: string): Promise<Technology> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/technologies/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getCategories(): Promise<string[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get('/api/v1/technologies/categories', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async search(query: string): Promise<Technology[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/technologies/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async create(technologyData: Partial<Technology>): Promise<Technology> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.post('/api/v1/technologies', technologyData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async update(id: string, technologyData: Partial<Technology>): Promise<Technology> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.put(`/api/v1/technologies/${id}`, technologyData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async delete(id: string): Promise<Technology> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.delete(`/api/v1/technologies/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  }
}