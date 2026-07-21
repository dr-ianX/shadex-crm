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
}
