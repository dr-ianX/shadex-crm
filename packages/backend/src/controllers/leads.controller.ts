import { Request, Response } from 'express'
import prisma from '../db'

export const leadsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, executiveId } = req.query
      
      const where: any = {}
      
      if (status) {
        where.status = status as string
      }
      
      if (executiveId) {
        where.executiveId = executiveId as string
      }
      
      const leads = await prisma.lead.findMany({
        where,
        include: {
          client: true,
          project: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: leads })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list leads' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const lead = await prisma.lead.findUnique({ 
        where: { id },
        include: {
          client: true,
          project: true,
          createdBy: true
        }
      })
      
      if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' })
      res.json({ success: true, data: lead })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get lead' })
    }
  },

  getByClient: async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params
      const leads = await prisma.lead.findMany({
        where: { clientId },
        include: {
          project: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: leads })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get leads by client' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      const created = await prisma.lead.create({ 
        data: payload,
        include: {
          client: true
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create lead' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.lead.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Lead not found' })
      
      const updated = await prisma.lead.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update lead' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }
      
      const existing = await prisma.lead.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Lead not found' })
      
      const updated = await prisma.lead.update({ 
        where: { id }, 
        data: { status }
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update lead status' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.lead.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Lead not found' })
      
      await prisma.lead.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete lead' })
    }
  },

  getFunnelStats: async (req: Request, res: Response) => {
    try {
      // Get counts by status
      const stats = await prisma.lead.groupBy({
        by: ['status'],
        _count: true,
        orderBy: {
          _count: {
            status: 'desc'
          }
        }
      })
      
      // Transform to object with status names
      const funnelStats = stats.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
      
      res.json({ success: true, data: funnelStats })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get funnel stats' })
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Search query required' })
      }
      
      const leads = await prisma.lead.findMany({
        where: {
          OR: [
            { problemDesc: { contains: query, mode: 'insensitive' } },
            { interestProduct: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          client: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: leads })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to search leads' })
    }
  }
}