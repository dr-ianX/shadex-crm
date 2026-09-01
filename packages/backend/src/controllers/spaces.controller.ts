import { Request, Response } from 'express'
import prisma from '../db'

export const spacesController = {
  listByProject: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params
      const spaces = await prisma.space.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' }
      })
      res.json({ success: true, data: spaces })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list spaces' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params
      const { name, width, height, quantity, unit, notes } = req.body

      const w = parseFloat(width)
      const h = parseFloat(height)
      const q = parseInt(quantity) || 1

      let widthMm = w
      let heightMm = h
      if (unit === 'cm') { widthMm = w * 10; heightMm = h * 10 }
      if (unit === 'm') { widthMm = w * 1000; heightMm = h * 1000 }

      const areaSqm = (widthMm * heightMm * q) / 1000000

      const created = await prisma.space.create({
        data: {
          projectId,
          name,
          width: widthMm,
          height: heightMm,
          quantity: q,
          areaSqm,
          unit,
          notes
        }
      })

      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create space' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { name, width, height, quantity, unit, notes } = req.body

      const existing = await prisma.space.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Space not found' })

      let widthMm = parseFloat(width)
      let heightMm = parseFloat(height)
      if (unit === 'cm') { widthMm = widthMm * 10; heightMm = heightMm * 10 }
      if (unit === 'm') { widthMm = widthMm * 1000; heightMm = heightMm * 1000 }

      const q = parseInt(quantity) || existing.quantity
      const areaSqm = (widthMm * heightMm * q) / 1000000

      const updated = await prisma.space.update({
        where: { id },
        data: { name, width: widthMm, height: heightMm, quantity: q, areaSqm, unit, notes }
      })

      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update space' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.space.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Space not found' })
      await prisma.space.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete space' })
    }
  }
}
