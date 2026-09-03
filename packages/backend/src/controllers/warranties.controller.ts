import { Request, Response } from 'express'
import prisma from '../db'

export const warrantiesController = {
  list: async (req: Request, res: Response) => {
    try {
      const { projectId, clientId } = req.query
      const where: any = {}
      
      if (projectId) where.projectId = projectId as string
      if (clientId) where.clientId = clientId as string
      
      const warranties = await prisma.warranty.findMany({
        where,
        include: {
          client: true,
          project: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: warranties })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list warranties' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const warranty = await prisma.warranty.findUnique({ 
        where: { id },
        include: {
          client: true,
          project: true,
          claims: true
        }
      })
      
      if (!warranty) return res.status(404).json({ success: false, error: 'Warranty not found' })
      res.json({ success: true, data: warranty })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get warranty' })
    }
  },

  getByQRCode: async (req: Request, res: Response) => {
    try {
      const { qrCode } = req.params
      
      const warranty = await prisma.warranty.findFirst({
        where: { qrCode }
      })
      
      if (!warranty) return res.status(404).json({ success: false, error: 'Warranty not found' })
      
      // Return limited info for public QR access
      res.json({ 
        success: true, 
        data: {
          warrantyId: warranty.warrantyId,
          startDate: warranty.startDate,
          endDate: warranty.endDate,
          years: warranty.years,
          qrCode: warranty.qrCode,
          message: 'Producto original SHADEX • Instalación registrada • Garantía vigente'
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get warranty by QR' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate warranty ID if not provided
      if (!payload.warrantyId) {
        const count = await prisma.warranty.count()
        const year = new Date().getFullYear()
        payload.warrantyId = `SX-W-${year}-${String(count + 1).padStart(6, '0')}`
      }
      
      // Generate QR code if not provided
      if (!payload.qrCode) {
        payload.qrCode = `W-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      
      // Set end date based on warranty years
      if (payload.startDate && payload.years && !payload.endDate) {
        const endDate = new Date(payload.startDate)
        endDate.setFullYear(endDate.getFullYear() + payload.years)
        payload.endDate = endDate
      }
      
      const created = await prisma.warranty.create({ 
        data: payload,
        include: {
          client: true,
          project: true
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create warranty' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.warranty.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Warranty not found' })
      
      const updated = await prisma.warranty.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update warranty' })
    }
  },

  getClaims: async (req: Request, res: Response) => {
    try {
      const { warrantyId } = req.params
      const claims = await prisma.warrantyClaim.findMany({
        where: { warrantyId },
        orderBy: { reportedAt: 'desc' }
      })
      res.json({ success: true, data: claims })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get warranty claims' })
    }
  },

  createClaim: async (req: Request, res: Response) => {
    try {
      const { warrantyId } = req.params
      const payload = req.body
      const existing = await prisma.warranty.findUnique({ where: { id: warrantyId } })
      if (!existing) return res.status(404).json({ success: false, error: 'Warranty not found' })
      const created = await prisma.warrantyClaim.create({
        data: {
          ...payload,
          warrantyId
        }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create warranty claim' })
    }
  },

  updateClaimStatus: async (req: Request, res: Response) => {
    try {
      const { warrantyId, claimId } = req.params
      const { status, notes } = req.body
      const existing = await prisma.warrantyClaim.findFirst({ where: { id: claimId, warrantyId } })
      if (!existing) return res.status(404).json({ success: false, error: 'Claim not found' })
      const updated = await prisma.warrantyClaim.update({
        where: { id: claimId },
        data: {
          status,
          notes,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : existing.resolvedAt
        }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update claim status' })
    }
  }
}
