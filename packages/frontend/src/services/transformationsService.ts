import axios from 'axios'
import { API_URL } from '../config'

const API_BASE = API_URL || 'http://localhost:3001'
axios.defaults.baseURL = API_BASE

export interface Transformation {
  id: string
  folioNumber: string
  name: string
  clientId: string
  clientContactPerson?: string
  sector: string
  projectType?: string
  status: string
  priority: string
  journeyPhase: string
  completionPercentage: number
  architectId?: string
  salesRepresentativeId?: string
  projectManagerId?: string
  country?: string
  state?: string
  city?: string
  address?: string
  coordinates?: string
  estimatedStartDate?: string
  estimatedCompletionDate?: string
  actualCompletionDate?: string
  startDate?: string
  endDate?: string
  estimatedBudget?: number
  approvedBudget?: number
  currency: string
  actualBudget?: number
  description?: string
  observations?: string
  notes?: string
  createdAt: string
  updatedAt: string
  client?: any
  technologies?: any[]
  quotations?: any[]
  installations?: any[]
  payments?: any[]
  supportCases?: any[]
  documents?: any[]
  warranty?: any
}

export const transformationsService = {
  async getAll(filters?: { status?: string; clientId?: string; projectType?: string }): Promise<Transformation[]> {
    const token = localStorage.getItem('shadex_access')
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.clientId) params.append('clientId', filters.clientId)
    if (filters?.projectType) params.append('projectType', filters.projectType)
    
    const response = await axios.get(`/api/v1/transformations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getById(id: string): Promise<Transformation> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/transformations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getByClient(clientId: string): Promise<Transformation[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/transformations/client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async create(transformationData: Partial<Transformation>): Promise<Transformation> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.post('/api/v1/transformations', transformationData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async update(id: string, transformationData: Partial<Transformation>): Promise<Transformation> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.put(`/api/v1/transformations/${id}`, transformationData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async updateStatus(id: string, status: string): Promise<Transformation> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.patch(`/api/v1/transformations/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async delete(id: string): Promise<Transformation> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.delete(`/api/v1/transformations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  }
}