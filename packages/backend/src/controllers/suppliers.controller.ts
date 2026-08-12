import { Request, Response } from 'express'
import prisma from '../db'

export const suppliersController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, businessType } = req.query
      const where: any = {}
      
      if (status) where.status = status as string
      if (businessType) where.businessType = businessType as string
      
      const items = await prisma.supplier.findMany({ 
        where,
        orderBy: { name: 'asc' },
        include: {
          technologies: true,
          inventoryItems: true,
          evaluations: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })
      res.json({ success: true, data: items })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list suppliers' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const item = await prisma.supplier.findUnique({ 
        where: { id },
        include: {
          technologies: true,
          inventoryItems: true,
          evaluations: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      if (!item) return res.status(404).json({ success: false, error: 'Supplier not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get supplier' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate code automatically if not provided
      if (!payload.code) {
        const lastSupplier = await prisma.supplier.findFirst({
          orderBy: { code: 'desc' }
        })
        const lastCodeNum = lastSupplier ? 
          parseInt(lastSupplier.code.replace(/\D/g, '')) || 0 : 0
        payload.code = `SUP-${String(lastCodeNum + 1).padStart(4, '0')}`
      }
      
      const created = await prisma.supplier.create({ data: payload })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create supplier' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      const existing = await prisma.supplier.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Supplier not found' })
      
      const updated = await prisma.supplier.update({ where: { id }, data: payload })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update supplier' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.supplier.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Supplier not found' })
      
      // Logical delete - update status to Inactive
      const updated = await prisma.supplier.update({ 
        where: { id }, 
        data: { status: 'Inactive' } 
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete supplier' })
    }
  },

  addEvaluation: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { rating, comments, evaluatorId } = req.body
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' })
      }
      
      const evaluation = await prisma.supplierEvaluation.create({
        data: {
          supplierId: id,
          rating,
          comments,
          evaluatorId
        }
      })
      
      // Update supplier's overall rating
      const evaluations = await prisma.supplierEvaluation.findMany({
        where: { supplierId: id }
      })
      const avgRating = evaluations.reduce((sum: number, e: any) => sum + (e as any).rating, 0) / evaluations.length
      
      await prisma.supplier.update({
        where: { id },
        data: { rating: Math.round(avgRating) }
      })
      
      res.status(201).json({ success: true, data: evaluation })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to add evaluation' })
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const suppliers = await prisma.supplier.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
            { contactPerson: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      })
      res.json({ success: true, data: suppliers })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search suppliers' })
    }
  }
}