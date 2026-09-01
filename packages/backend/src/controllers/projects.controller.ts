import { Request, Response } from 'express'
import prisma from '../db'

export const projectsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, clientId } = req.query
      const where: any = {}

      if (status) where.status = status as string
      if (clientId) where.clientId = clientId as string

      const projects = await prisma.project.findMany({
        where,
        include: {
          client: true,
          lead: true,
          quotations: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.json({ success: true, data: projects })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list projects' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          client: true,
          lead: true,
          spaces: true,
          quotations: {
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
          },
          payments: true,
          installations: true,
          warranties: true,
          documents: true,
          tasks: true
        }
      })

      if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
      res.json({ success: true, data: project })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get project' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body

      const created = await prisma.project.create({
        data: payload,
        include: {
          client: true,
          lead: true
        }
      })

      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create project' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body

      const existing = await prisma.project.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Project not found' })

      const updated = await prisma.project.update({
        where: { id },
        data: payload
      })

      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update project' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }

      const existing = await prisma.project.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Project not found' })

      const updated = await prisma.project.update({
        where: { id },
        data: { status }
      })

      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update project status' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.project.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Project not found' })

      // Delete related data in correct order to respect FK constraints
      await prisma.$transaction(async (tx: any) => {
        // Get related quotations
        const quotations = await tx.quotation.findMany({ where: { projectId: id }, select: { id: true } })
        for (const q of quotations) {
          await tx.quotationItem.deleteMany({ where: { quotationId: q.id } })
          await tx.payment.deleteMany({ where: { quotationId: q.id } })
        }
        await tx.quotation.deleteMany({ where: { projectId: id } })

        // Delete installations with their checklist/evidence
        const installations = await tx.installation.findMany({ where: { projectId: id }, select: { id: true } })
        for (const inst of installations) {
          await tx.installationChecklist.deleteMany({ where: { installationId: inst.id } })
          await tx.installationEvidence.deleteMany({ where: { installationId: inst.id } })
        }
        await tx.installation.deleteMany({ where: { projectId: id } })

        await tx.warranty.deleteMany({ where: { projectId: id } })
        await tx.payment.deleteMany({ where: { projectId: id } })
        await tx.document.deleteMany({ where: { projectId: id } })
        await tx.task.deleteMany({ where: { projectId: id } })
        await tx.appointment.deleteMany({ where: { projectId: id } })
        await tx.space.deleteMany({ where: { projectId: id } })

        await tx.project.delete({ where: { id } })
      })

      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete project' })
    }
  },

  getProfitability: async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          quotations: {
            where: { status: 'ACCEPTED' },
            include: { items: { include: { product: true } } }
          },
          payments: { where: { status: 'CONFIRMED' } }
        }
      })

      if (!project) return res.status(404).json({ success: false, error: 'Project not found' })

      const acceptedQuotation = project.quotations[0]
      const totalRevenue = acceptedQuotation?.total || 0

      // Cost from quotation items (estimate before installation)
      let estimatedCost = 0
      if (acceptedQuotation) {
        for (const item of acceptedQuotation.items) {
          if (item.product?.cost) {
            estimatedCost += item.product.cost * item.quantity
          }
        }
      }

      // Cost from real material consumed
      const movements = await prisma.inventoryMovement.findMany({
        where: { projectId: id, type: 'CONSUMPTION' },
        include: { roll: { include: { product: true } } }
      })
      let realMaterialCost = 0
      for (const movement of movements) {
        if (movement.roll?.product?.cost) {
          realMaterialCost += movement.quantity * movement.roll.product.cost
        }
      }

      const totalPayments = project.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
      const grossProfit = totalRevenue - estimatedCost
      const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

      res.json({
        success: true,
        data: {
          totalRevenue,
          estimatedCost,
          realMaterialCost,
          grossProfit,
          margin: parseFloat(margin.toFixed(2)),
          totalPayments,
          pendingBalance: totalRevenue - totalPayments
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get profitability' })
    }
  }
}
