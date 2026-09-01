import { Request, Response } from 'express'
import prisma from '../db'

export const tasksController = {
  list: async (req: Request, res: Response) => {
    try {
      const { projectId, clientId, assignedTo } = req.query
      const where: any = {}
      if (projectId) where.projectId = projectId as string
      if (clientId) where.clientId = clientId as string
      if (assignedTo) where.assignedTo = assignedTo as string

      const tasks = await prisma.task.findMany({
        where,
        include: { project: true, client: true },
        orderBy: { createdAt: 'desc' }
      })
      res.json({ success: true, data: tasks })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list tasks' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const created = await prisma.task.create({
        data: req.body,
        include: { project: true, client: true }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create task' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.task.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Task not found' })

      const updated = await prisma.task.update({
        where: { id },
        data: req.body,
        include: { project: true, client: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update task' })
    }
  },

  complete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const updated = await prisma.task.update({
        where: { id },
        data: { isCompleted: true, completedAt: new Date() },
        include: { project: true, client: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to complete task' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await prisma.task.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete task' })
    }
  }
}
