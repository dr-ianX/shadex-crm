import { Request, Response } from 'express'
import prisma from '../db'

export const auditController = {
  list: async (req: Request, res: Response) => {
    try {
      const { entity, entityId, userId } = req.query
      const where: any = {}
      if (entity) where.entity = entity as string
      if (entityId) where.entityId = entityId as string
      if (userId) where.userId = userId as string

      const logs = await prisma.auditLog.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 200
      })
      res.json({ success: true, data: logs })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get audit logs' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { entity, entityId, action, oldValue, newValue } = req.body
      const user = (req as any).user

      const created = await prisma.auditLog.create({
        data: {
          userId: user.userId,
          entity,
          entityId,
          action,
          oldValue: oldValue ? JSON.stringify(oldValue) : null,
          newValue: newValue ? JSON.stringify(newValue) : null,
          ipAddress: req.ip
        }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create audit log' })
    }
  }
}
