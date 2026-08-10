import axios from 'axios'
import { API_URL } from '../config'

const API_BASE = API_URL || 'http://localhost:3001'
axios.defaults.baseURL = API_BASE

export interface Client {
  id: string
  code: string
  name: string
  email?: string
  phone?: string
  secondaryPhone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  clientType: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const clientsService = {
  async getAll(): Promise<Client[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get('/api/v1/clients', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getById(id: string): Promise<Client> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async search(query: string): Promise<Client[]> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.get(`/api/v1/clients/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async create(clientData: Partial<Client>): Promise<Client> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.post('/api/v1/clients', clientData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async update(id: string, clientData: Partial<Client>): Promise<Client> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.put(`/api/v1/clients/${id}`, clientData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async delete(id: string): Promise<Client> {
    const token = localStorage.getItem('shadex_access')
    const response = await axios.delete(`/api/v1/clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  }
}