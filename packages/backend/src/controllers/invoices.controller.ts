import { Request, Response } from 'express'
import prisma from '../db'

export const invoicesController = {
  list: async (req: Request, res: Response) => {
    try {
      const { projectId, clientId, status } = req.query
      const where: any = {}
      if (projectId) where.projectId = projectId as string
      if (clientId) where.clientId = clientId as string
      if (status) where.status = status as string

      const invoices = await prisma.invoice.findMany({
        where,
        include: { client: true, project: true, quotation: true },
        orderBy: { createdAt: 'desc' }
      })
      res.json({ success: true, data: invoices })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list invoices' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body

      if (!payload.invoiceId) {
        const count = await prisma.invoice.count()
        const year = new Date().getFullYear()
        payload.invoiceId = `SX-F-${year}-${String(count + 1).padStart(6, '0')}`
      }

      const created = await prisma.invoice.create({
        data: payload,
        include: { client: true, project: true, quotation: true }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create invoice' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { client: true, project: true, quotation: true }
      })
      if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' })
      res.json({ success: true, data: invoice })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get invoice' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      const data: any = { status }
      if (status === 'ISSUED') data.issuedAt = new Date()
      if (status === 'CANCELLED') data.cancelledAt = new Date()

      const updated = await prisma.invoice.update({
        where: { id },
        data,
        include: { client: true, project: true, quotation: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update invoice status' })
    }
  }
}
