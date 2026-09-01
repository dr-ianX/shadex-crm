import { Request, Response } from 'express'
import prisma from '../db'

export const appointmentsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { projectId, clientId, status } = req.query
      const where: any = {}
      
      if (projectId) where.projectId = projectId as string
      if (clientId) where.clientId = clientId as string
      if (status) where.status = status as string
      
      const appointments = await prisma.appointment.findMany({
        where,
        include: { client: true, project: true },
        orderBy: { date: 'asc' }
      })
      
      res.json({ success: true, data: appointments })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list appointments' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { client: true, project: true }
      })
      if (!appointment) return res.status(404).json({ success: false, error: 'Appointment not found' })
      res.json({ success: true, data: appointment })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get appointment' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      const created = await prisma.appointment.create({
        data: payload,
        include: { client: true, project: true }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create appointment' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      const existing = await prisma.appointment.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' })
      const updated = await prisma.appointment.update({
        where: { id },
        data: payload,
        include: { client: true, project: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update appointment' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      const existing = await prisma.appointment.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' })
      const updated = await prisma.appointment.update({
        where: { id },
        data: { status },
        include: { client: true, project: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update appointment status' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.appointment.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' })
      await prisma.appointment.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete appointment' })
    }
  }
}
