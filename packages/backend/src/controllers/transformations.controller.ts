import { Request, Response } from 'express'
import prisma from '../db'

export const transformationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, clientId, projectType } = req.query
      const where: any = {}
      
      if (status) where.status = status as string
      if (clientId) where.clientId = clientId as string
      if (projectType) where.projectType = projectType as string
      
      const items = await prisma.transformation.findMany({ 
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
          client: true,
          technologies: {
            include: {
              technology: true
            }
          }
        }
      })
      res.json({ success: true, data: items })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list transformations' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const item = await prisma.transformation.findUnique({ 
        where: { id },
        include: {
          client: true,
          technologies: {
            include: {
              technology: true
            }
          },
          quotations: true,
          installations: true,
          payments: true,
          supportCases: true,
          documents: true,
          warranty: true
        }
      })
      if (!item) return res.status(404).json({ success: false, error: 'Transformation not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get transformation' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate folio number automatically
      const lastTransformation = await prisma.transformation.findFirst({
        orderBy: { folioNumber: 'desc' }
      })
      
      const lastFolioNum = lastTransformation ? 
        parseInt(lastTransformation.folioNumber.replace(/\D/g, '')) || 0 : 0
      const newFolioNumber = `SHA-${String(lastFolioNum + 1).padStart(4, '0')}`
      
      const created = await prisma.transformation.create({
        data: {
          ...payload,
          folioNumber: newFolioNumber
        },
        include: {
          client: true
        }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create transformation' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      const existing = await prisma.transformation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Transformation not found' })
      
      const updated = await prisma.transformation.update({ 
        where: { id }, 
        data: payload,
        include: {
          client: true
        }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update transformation' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }
      
      const existing = await prisma.transformation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Transformation not found' })
      
      // Map status to journey phase
      const statusToJourney: Record<string, string> = {
        'Lead': 'Discover',
        'Contacted': 'Discover',
        'Levantamiento': 'Curate',
        'Cotización': 'Design',
        'Seguimiento': 'Design',
        'Anticipo': 'Design',
        'Instalación programada': 'Transform',
        'Instalación': 'Transform',
        'Garantía': 'Experience',
        'Finalizado': 'Experience',
        'Cancelado': 'Discover'
      }
      
      const updated = await prisma.transformation.update({ 
        where: { id }, 
        data: { 
          status,
          journeyPhase: statusToJourney[status] || 'Discover'
        },
        include: {
          client: true
        }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update transformation status' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.transformation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Transformation not found' })
      
      // Logical delete - update status to Cancelled
      const updated = await prisma.transformation.update({ 
        where: { id }, 
        data: { status: 'Cancelado' } 
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete transformation' })
    }
  },

  getByClient: async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params
      const transformations = await prisma.transformation.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
          technologies: {
            include: {
              technology: true
            }
          }
        }
      })
      res.json({ success: true, data: transformations })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get client transformations' })
    }
  }
}
