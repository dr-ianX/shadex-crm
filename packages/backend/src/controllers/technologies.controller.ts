import { Request, Response } from 'express'
import prisma from '../db'

export const technologiesController = {
  list: async (req: Request, res: Response) => {
    try {
      const { category, status } = req.query
      const where: any = {}
      
      if (category) where.category = category as string
      if (status) where.status = status as string
      
      const items = await prisma.technology.findMany({ 
        where,
        orderBy: { name: 'asc' },
        include: {
          supplier: true,
          inventoryItems: true
        }
      })
      res.json({ success: true, data: items })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list technologies' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const item = await prisma.technology.findUnique({ 
        where: { id },
        include: {
          supplier: true,
          inventoryItems: true,
          transformationTechnologies: true,
          priceHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
      if (!item) return res.status(404).json({ success: false, error: 'Technology not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get technology' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate code automatically if not provided
      if (!payload.code) {
        const lastTech = await prisma.technology.findFirst({
          orderBy: { code: 'desc' }
        })
        const lastCodeNum = lastTech ? 
          parseInt(lastTech.code.replace(/\D/g, '')) || 0 : 0
        payload.code = `TECH-${String(lastCodeNum + 1).padStart(4, '0')}`
      }
      
      const created = await prisma.technology.create({
        data: payload,
        include: {
          supplier: true
        }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create technology' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      // If price changed, record in price history
      if (payload.salePrice || payload.costPrice) {
        const existing = await prisma.technology.findUnique({ where: { id } })
        if (existing) {
          if (payload.salePrice && payload.salePrice !== existing.salePrice) {
            await prisma.priceHistory.create({
              data: {
                technologyId: id,
                costPrice: payload.costPrice || existing.costPrice,
                salePrice: payload.salePrice,
                marginPercentage: payload.marginPercentage || existing.marginPercentage,
                changedBy: req.body.userId || 'system'
              }
            })
          }
        }
      }
      
      const updated = await prisma.technology.update({ 
        where: { id }, 
        data: payload,
        include: {
          supplier: true
        }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update technology' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.technology.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Technology not found' })
      
      // Logical delete - update status to Discontinued
      const updated = await prisma.technology.update({ 
        where: { id }, 
        data: { status: 'Discontinued' } 
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete technology' })
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const technologies = await prisma.technology.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      })
      res.json({ success: true, data: technologies })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search technologies' })
    }
  },

  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.technology.findMany({
        select: { category: true },
        distinct: ['category']
      })
      const categoryList = categories.map((c: { category: string }) => c.category)
      res.json({ success: true, data: categoryList })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get categories' })
    }
  }
}