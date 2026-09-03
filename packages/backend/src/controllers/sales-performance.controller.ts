import { Request, Response } from 'express'
import prisma from '../db'

export const salesPerformanceController = {
  list: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        where: { role: { in: ['ADMIN_GENERAL', 'VENTAS'] } }
      })

      const leads = await prisma.lead.findMany()
      const quotations = await prisma.quotation.findMany({ include: { items: true } })
      const payments = await prisma.payment.findMany({ where: { status: 'CONFIRMED' } })

      const performance = users.map((u: any) => {
        const userLeads = leads.filter((l: any) => l.createdById === u.id || l.executiveId === u.id)
        const userQuotations = quotations.filter((q: any) => q.createdById === u.id)
        const userPayments = payments.filter((p: any) => p.createdById === u.id)
        const accepted = userQuotations.filter((q: any) => q.status === 'ACCEPTED')

        return {
          userId: u.id,
          name: u.name,
          email: u.email,
          leads: userLeads.length,
          quotations: userQuotations.length,
          quotedTotal: userQuotations.reduce((sum: number, q: any) => sum + (q.total || 0), 0),
          acceptedQuotations: accepted.length,
          acceptedTotal: accepted.reduce((sum: number, q: any) => sum + (q.total || 0), 0),
          collected: userPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
          winRate: userQuotations.length > 0 ? (accepted.length / userQuotations.length) * 100 : 0
        }
      })

      res.json({ success: true, data: performance })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get sales performance' })
    }
  }
}
