import { Request, Response } from 'express'
import prisma from '../db'

export const financeController = {
  // Payments
  listPayments: async (req: Request, res: Response) => {
    try {
      const { status, type, quotationId, projectId } = req.query
      
      const where: any = {}
      
      if (status) {
        where.status = status as string
      }
      
      if (type) {
        where.type = type as string
      }
      
      if (quotationId) {
        where.quotationId = quotationId as string
      }
      
      if (projectId) {
        where.projectId = projectId as string
      }
      
      const payments = await prisma.payment.findMany({
        where,
        include: {
          client: true,
          quotation: true,
          project: true
        },
        orderBy: { date: 'desc' }
      })
      
      res.json({ success: true, data: payments })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list payments' })
    }
  },

  getPaymentById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payment = await prisma.payment.findUnique({ 
        where: { id },
        include: {
          client: true,
          quotation: true,
          project: true
        }
      })
      
      if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' })
      res.json({ success: true, data: payment })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get payment' })
    }
  },

  createPayment: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      const created = await prisma.payment.create({
        data: payload,
        include: {
          client: true,
          quotation: true,
          project: true
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create payment' })
    }
  },

  updatePayment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.payment.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Payment not found' })
      
      const updated = await prisma.payment.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update payment' })
    }
  },

  updatePaymentStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }
      
      const existing = await prisma.payment.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Payment not found' })
      
      const updated = await prisma.payment.update({ 
        where: { id }, 
        data: { status }
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update payment status' })
    }
  },

  // Accounts Receivable
  getAccountsReceivable: async (req: Request, res: Response) => {
    try {
      const { clientId, overdue } = req.query
      
      const where: any = {
        status: 'PENDING'
      }
      
      if (clientId) {
        where.clientId = clientId as string
      }
      
      if (overdue === 'true') {
        where.date = {
          lt: new Date()
        }
      }
      
      const receivables = await prisma.payment.findMany({
        where,
        include: {
          client: true,
          quotation: true,
          project: true
        },
        orderBy: { date: 'asc' }
      })
      
      res.json({ success: true, data: receivables })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get accounts receivable' })
    }
  },

  // Expenses - temporary stub since Expense model does not exist yet
  listExpenses: async (req: Request, res: Response) => {
    res.json({ success: true, data: [] })
  },

  createExpense: async (req: Request, res: Response) => {
    res.status(501).json({ success: false, error: 'Expense tracking not yet implemented' })
  },

  // Project Margins
  calculateProjectMargin: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params
      
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          quotations: {
            include: {
              items: true
            }
          },
          payments: true
        }
      })
      
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
      
      const acceptedQuotation = project.quotations?.find((q: any) => q.status === 'ACCEPTED') || project.quotations?.[0]
      const totalRevenue = acceptedQuotation?.total || 0
      const totalPayments = project.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
      const totalExpenses = 0
      const materialCost = acceptedQuotation?.items?.reduce((sum: number, item: any) =>
        sum + ((item.unitPrice || 0) * (item.quantity || 0)), 0) || 0
      
      const grossMargin = totalRevenue - materialCost
      const netMargin = totalRevenue - totalExpenses
      const grossMarginPercent = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0
      const netMarginPercent = totalRevenue > 0 ? (netMargin / totalRevenue) * 100 : 0
      
      res.json({ 
        success: true, 
        data: {
          projectId,
          totalRevenue,
          totalPayments,
          totalExpenses,
          materialCost,
          grossMargin,
          netMargin,
          grossMarginPercent,
          netMarginPercent,
          balance: totalRevenue - totalPayments
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to calculate project margin' })
    }
  },

  // Financial Summary
  getFinancialSummary: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query
      
      const dateFilter: any = {}
      if (startDate) {
        dateFilter.gte = new Date(startDate as string)
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate as string)
      }
      
      const [totalRevenue, totalPayments, totalExpenses, pendingPayments] = await Promise.all([
        prisma.quotation.aggregate({
          where: Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {},
          _sum: { total: true }
        }),
        prisma.payment.aggregate({
          where: {
            status: 'CONFIRMED',
            ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
          },
          _sum: { amount: true }
        }),
        prisma.payment.aggregate({
          where: {
            status: 'PENDING',
            ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
          },
          _sum: { amount: true }
        }),
        prisma.payment.aggregate({
          where: {
            status: 'PENDING'
          },
          _sum: { amount: true }
        })
      ])
      
      res.json({ 
        success: true, 
        data: {
          totalRevenue: totalRevenue._sum.total || 0,
          totalPayments: totalPayments._sum.amount || 0,
          totalExpenses: 0,
          pendingPayments: pendingPayments._sum.amount || 0,
          netProfit: (totalPayments._sum.amount || 0)
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get financial summary' })
    }
  }
}