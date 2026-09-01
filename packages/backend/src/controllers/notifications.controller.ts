import { Request, Response } from 'express'
import prisma from '../db'

export const notificationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
      res.json({ success: true, data: notifications })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list notifications' })
    }
  },

  getUnreadCount: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId
      const count = await prisma.notification.count({
        where: { userId, isRead: false }
      })
      res.json({ success: true, data: count })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get unread count' })
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to mark notification as read' })
    }
  }
}
