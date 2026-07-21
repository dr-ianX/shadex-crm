import { Request, Response } from 'express'
import prisma from '../db'

export const transformationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const items = await prisma.transformation.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
      res.json({ success: true, data: items })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list transformations' })
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const item = await prisma.transformation.findUnique({ where: { id } })
      if (!item) return res.status(404).json({ success: false, error: 'Transformation not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get transformation' })
    }
  }
}
