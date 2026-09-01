import { Request, Response } from 'express'
import prisma from '../db'

export const inventoryController = {
  // Roll Inventory - Control por rollo
  listRolls: async (req: Request, res: Response) => {
    try {
      const { status, location, productId } = req.query
      
      const where: any = {}
      
      if (status) {
        where.status = status as string
      }
      
      if (location) {
        where.location = location as string
      }
      
      if (productId) {
        where.productId = productId as string
      }
      
      const rolls = await prisma.rollInventory.findMany({
        where,
        include: {
          product: true,
          movements: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        },
        orderBy: { receivedDate: 'desc' }
      })
      
      res.json({ success: true, data: rolls })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list roll inventory' })
    }
  },

  getRollById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const roll = await prisma.rollInventory.findUnique({ 
        where: { id },
        include: {
          product: true,
          movements: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      
      if (!roll) return res.status(404).json({ success: false, error: 'Roll not found' })
      res.json({ success: true, data: roll })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get roll' })
    }
  },

  createRoll: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate roll code if not provided
      if (!payload.rollCode) {
        const count = await prisma.rollInventory.count()
        const productPrefix = payload.productId ? `ROLL-${payload.productId.split('-')[0]}` : 'ROLL'
        payload.rollCode = `${productPrefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`
      }
      
      const created = await prisma.rollInventory.create({ 
        data: payload,
        include: {
          product: true
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create roll' })
    }
  },

  updateRoll: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.rollInventory.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Roll not found' })
      
      const updated = await prisma.rollInventory.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update roll' })
    }
  },

  // Inventory Movements
  createMovement: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      const created = await prisma.inventoryMovement.create({ 
        data: payload,
        include: {
          roll: {
            include: {
              product: true
            }
          }
        }
      })
      
      // Update roll available length
      if (payload.newLength !== undefined) {
        await prisma.rollInventory.update({
          where: { id: payload.rollId },
          data: { availableLength: payload.newLength }
        })
      }
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create movement' })
    }
  },

  getMovements: async (req: Request, res: Response) => {
    try {
      const { rollId, projectId, type } = req.query
      
      const where: any = {}
      
      if (rollId) {
        where.rollId = rollId as string
      }
      
      if (projectId) {
        where.projectId = projectId as string
      }
      
      if (type) {
        where.type = type as string
      }
      
      const movements = await prisma.inventoryMovement.findMany({
        where,
        include: {
          roll: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: movements })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list movements' })
    }
  },

  // General Inventory Items
  listItems: async (req: Request, res: Response) => {
    try {
      const { location, productId } = req.query
      
      const where: any = {}
      
      if (location) {
        where.location = location as string
      }
      
      if (productId) {
        where.productId = productId as string
      }
      
      const items = await prisma.inventoryItem.findMany({
        where,
        include: {
          product: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: items })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list inventory items' })
    }
  },

  getLowStock: async (req: Request, res: Response) => {
    try {
      // Get all items with their minimum stock
      const items = await prisma.inventoryItem.findMany({
        include: {
          product: true
        },
        orderBy: { quantity: 'asc' }
      })
      
      // Filter low stock items manually
      const lowStockItems = items.filter((item: any) => 
        item.quantity <= item.minimumStock || item.quantity <= item.reorderPoint
      )
      
      res.json({ success: true, data: lowStockItems })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get low stock items' })
    }
  },

  // Overall inventory stats
  getStats: async (req: Request, res: Response) => {
    try {
      const [totalRolls, availableRolls, reservedRolls, totalItems] = await Promise.all([
        prisma.rollInventory.count(),
        prisma.rollInventory.count({ where: { status: 'AVAILABLE' } }),
        prisma.rollInventory.count({ where: { status: { in: ['RESERVED', 'PARTIALLY_USED'] } } }),
        prisma.inventoryItem.count()
      ])
      
      // Get low stock count manually
      const items = await prisma.inventoryItem.findMany()
      const lowStockCount = items.filter((item: any) => 
        item.quantity <= item.minimumStock || item.quantity <= item.reorderPoint
      ).length
      
      res.json({ 
        success: true, 
        data: {
          totalRolls,
          availableRolls,
          reservedRolls,
          totalItems,
          lowStockCount
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get inventory stats' })
    }
  },

  reserveForProject: async (req: Request, res: Response) => {
    try {
      const { rollId } = req.params
      const { projectId, meters, reason } = req.body

      if (!meters || meters <= 0) return res.status(400).json({ success: false, error: 'Invalid meters' })

      const roll = await prisma.rollInventory.findUnique({ where: { id: rollId } })
      if (!roll) return res.status(404).json({ success: false, error: 'Roll not found' })
      if (roll.availableLength < meters) return res.status(400).json({ success: false, error: 'Not enough material' })

      const newLength = roll.availableLength - meters
      const newStatus = newLength <= 0 ? 'DEPLETED' : (newLength < roll.initialLength ? 'PARTIALLY_USED' : roll.status)

      const [updated, movement] = await prisma.$transaction([
        prisma.rollInventory.update({
          where: { id: rollId },
          data: { availableLength: newLength, status: newStatus as any }
        }),
        prisma.inventoryMovement.create({
          data: {
            rollId,
            type: 'RESERVATION',
            quantity: meters,
            previousLength: roll.availableLength,
            newLength,
            projectId,
            reason
          }
        })
      ])

      res.json({ success: true, data: { roll: updated, movement } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to reserve material' })
    }
  },

  consumeForProject: async (req: Request, res: Response) => {
    try {
      const { rollId } = req.params
      const { projectId, meters, reason } = req.body

      if (!meters || meters <= 0) return res.status(400).json({ success: false, error: 'Invalid meters' })

      const roll = await prisma.rollInventory.findUnique({ where: { id: rollId } })
      if (!roll) return res.status(404).json({ success: false, error: 'Roll not found' })

      // Calculate how much of the reserved material is now consumed
      const reserved = await prisma.inventoryMovement.aggregate({
        where: { rollId, projectId, type: 'RESERVATION' },
        _sum: { quantity: true }
      })
      const consumed = await prisma.inventoryMovement.aggregate({
        where: { rollId, projectId, type: 'CONSUMPTION' },
        _sum: { quantity: true }
      })
      const availableToConsume = (reserved._sum.quantity || 0) - (consumed._sum.quantity || 0)

      if (meters > availableToConsume) {
        return res.status(400).json({ success: false, error: 'Cannot consume more than reserved' })
      }

      const movement = await prisma.inventoryMovement.create({
        data: {
          rollId,
          type: 'CONSUMPTION',
          quantity: meters,
          projectId,
          reason
        }
      })

      res.json({ success: true, data: movement })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to consume material' })
    }
  }
}