import { Request, Response } from 'express'
import prisma from '../db'

export const clientsController = {
  list: async (req: Request, res: Response) => {
    try {
      const clients = await prisma.client.findMany({ 
        orderBy: { createdAt: 'desc' } 
      })
      res.json({ success: true, data: clients })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list clients' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const client = await prisma.client.findUnique({ 
        where: { id },
        include: {
          leads: true,
          projects: true,
          quotations: true,
          payments: true,
          installations: true,
          warranties: true,
          documents: true,
          tasks: true,
          appointments: true
        }
      })
      if (!client) return res.status(404).json({ success: false, error: 'Client not found' })
      res.json({ success: true, data: client })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get client' })
    }
  },

  getByCode: async (req: Request, res: Response) => {
    try {
      const { code } = req.params
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ success: false, error: 'Client code required' })
      }
      
      const client = await prisma.client.findUnique({ 
        where: { code },
        include: {
          leads: true,
          projects: true,
          quotations: true,
          payments: true,
          installations: true,
          warranties: true,
          documents: true,
          tasks: true,
          appointments: true
        }
      })
      
      if (!client) return res.status(404).json({ success: false, error: 'Client not found' })
      res.json({ success: true, data: client })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get client by code' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const raw = req.body
      
      // Whitelist allowed fields
      const allowedFields = ['code', 'type', 'name', 'lastName', 'companyName', 'phone', 'whatsapp', 'email', 'rfc', 'fiscalAddress', 'fiscalZipCode', 'taxRegime', 'cfdiUsage', 'address', 'city', 'state', 'country', 'notes', 'source', 'status']
      const payload: any = {}
      allowedFields.forEach(f => {
        if (raw[f] !== undefined) payload[f] = raw[f]
      })
      
      // Generate client code if not provided
      if (!payload.code) {
        const count = await prisma.client.count()
        payload.code = `CLI-${String(count + 1).padStart(4, '0')}`
      }
      
      // Map clientType to type and normalize to valid ClientType enum
      const clientTypeMap: Record<string, string> = {
        'Regular': 'RESIDENTIAL',
        'VIP': 'CORPORATE',
        'New': 'RESIDENTIAL',
        'Residential': 'RESIDENTIAL',
        'Corporate': 'CORPORATE',
        'Commercial': 'COMMERCIAL',
        'Institutional': 'INSTITUTIONAL'
      }
      if (raw.clientType) {
        payload.type = clientTypeMap[raw.clientType] || 'RESIDENTIAL'
      } else if (raw.type && !clientTypeMap[raw.type] && !Object.values(clientTypeMap).includes(raw.type)) {
        payload.type = 'RESIDENTIAL'
      }
      
      const created = await prisma.client.create({ data: payload })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create client' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      const existing = await prisma.client.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Client not found' })
      const updated = await prisma.client.update({ where: { id }, data: payload })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update client' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.client.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Client not found' })
      
      // Logical delete - update status to Inactive
      const updated = await prisma.client.update({ 
        where: { id }, 
        data: { status: 'Inactive' } 
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete client' })
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const clients = await prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { companyName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { whatsapp: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
            { rfc: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      })
      res.json({ success: true, data: clients })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search clients' })
    }
  },
}