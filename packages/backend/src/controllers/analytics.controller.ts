import { Request, Response } from 'express'
import prisma from '../db'

export const analyticsController = {
  get: async (req: Request, res: Response) => {
    try {
      const [leads, quotations, projects, payments, products, inventory] = await Promise.all([
        prisma.lead.findMany(),
        prisma.quotation.findMany(),
        prisma.project.findMany(),
        prisma.payment.findMany({ where: { status: 'CONFIRMED' } }),
        prisma.product.findMany(),
        prisma.rollInventory.findMany({ include: { product: true } })
      ])

      const won = leads.filter((l: any) => l.status === 'WON').length
      const lost = leads.filter((l: any) => l.status === 'LOST').length
      const conversionRate = leads.length > 0 ? (won / leads.length) * 100 : 0

      const quotedTotal = quotations.reduce((sum: number, q: any) => sum + (q.total || 0), 0)
      const acceptedTotal = quotations.filter((q: any) => q.status === 'ACCEPTED').reduce((sum: number, q: any) => sum + (q.total || 0), 0)
      const winRate = quotations.length > 0 ? (quotations.filter((q: any) => q.status === 'ACCEPTED').length / quotations.length) * 100 : 0

      const revenue = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

      const activeProjects = projects.filter((p: any) => p.status !== 'COMPLETED').length
      const completedProjects = projects.filter((p: any) => p.status === 'COMPLETED').length

      const inventoryValue = inventory.reduce((sum: number, r: any) => sum + ((r.product?.cost || 0) * (r.availableLength || 0)), 0)

      res.json({
        success: true,
        data: {
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          winRate: parseFloat(winRate.toFixed(2)),
          quotedTotal,
          acceptedTotal,
          revenue,
          activeProjects,
          completedProjects,
          totalProducts: products.length,
          inventoryValue: parseFloat(inventoryValue.toFixed(2))
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get analytics' })
    }
  }
}
