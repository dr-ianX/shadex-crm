import { Request, Response } from 'express'
import prisma from '../db'

export const productsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { family, isActive } = req.query
      
      const where: any = {}
      
      if (family) {
        where.family = family as string
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true'
      }
      
      const products = await prisma.product.findMany({
        where,
        orderBy: [
          { family: 'asc' },
          { commercialName: 'asc' }
        ]
      })
      
      res.json({ success: true, data: products })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list products' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const product = await prisma.product.findUnique({ 
        where: { id },
        include: {
          inventoryItems: true,
          rollInventory: true,
          quotationItems: true
        }
      })
      
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
      res.json({ success: true, data: product })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get product' })
    }
  },

  getBySku: async (req: Request, res: Response) => {
    try {
      const { sku } = req.params
      const product = await prisma.product.findUnique({ 
        where: { sku },
        include: {
          inventoryItems: true,
          rollInventory: true
        }
      })
      
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
      res.json({ success: true, data: product })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get product by SKU' })
    }
  },

  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.product.findMany({
        select: {
          family: true
        },
        distinct: ['family']
      })
      
      const categoryList = categories.map((c: any) => c.family)
      res.json({ success: true, data: categoryList })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get categories' })
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { sku: { contains: query, mode: 'insensitive' } },
            { commercialName: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { variant: { contains: query, mode: 'insensitive' } },
            { color: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { commercialName: 'asc' }
      })
      
      res.json({ success: true, data: products })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search products' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      const created = await prisma.product.create({ data: payload })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create product' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.product.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Product not found' })
      
      const updated = await prisma.product.update({ where: { id }, data: payload })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update product' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.product.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Product not found' })
      
      // Soft delete - mark as inactive
      const updated = await prisma.product.update({ 
        where: { id }, 
        data: { isActive: false } 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete product' })
    }
  }
}