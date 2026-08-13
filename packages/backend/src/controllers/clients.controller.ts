import { Request, Response } from 'express'
import prisma from '../db'

export const clientsController = {
  list: async (req: Request, res: Response) => {
    try {
      const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
      res.json({ success: true, data: clients })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list clients' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const client = await prisma.client.findUnique({ where: { id } })
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
          technologies: true,
          documents: true,
          quotations: true,
          payments: true,
          supportCases: true,
          tasks: true
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
      const payload = req.body
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
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      })
      res.json({ success: true, data: clients })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search clients' })
    }
  },

  updateClient: async (req: Request, res: Response) => {
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

  deleteClient: async (req: Request, res: Response) => {
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

  searchClients: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const clients = await prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      })
      res.json({ success: true, data: clients })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search clients' })
    }
  },

  uploadDocumentToTask: async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params
      const { clientId, documentId } = req.body
      
      if (!clientId || !documentId) {
        return res.status(400).json({ success: false, error: 'Client ID and Document ID required' })
      }
      
      const client = await prisma.client.findUnique({ where: { id: clientId } })
      if (!client) return res.status(404).json({ success: false, error: 'Client not found' })
      
      const documentExists = await prisma.document.findUnique({ 
        where: { id: documentId } 
      })
      if (!documentExists) return res.status(404).json({ success: false, error: 'Document not found' })
      
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          clientId: clientId,
          documentId: documentId
        }
      })
      
      res.json({ success: true, data: updatedTask })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to upload document to task' })
    }
  }
}
