import { Request, Response } from 'express'
import prisma from '../db'

export const installationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, projectId, installerId } = req.query
      
      const where: any = {}
      
      if (status) {
        where.status = status as string
      }
      
      if (projectId) {
        where.projectId = projectId as string
      }
      
      if (installerId) {
        where.installerId = installerId as string
      }
      
      const installations = await prisma.installation.findMany({
        where,
        include: {
          project: true,
          client: true,
          checklists: true,
          evidences: true
        },
        orderBy: { date: 'desc' }
      })
      
      res.json({ success: true, data: installations })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list installations' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const installation = await prisma.installation.findUnique({ 
        where: { id },
        include: {
          project: true,
          client: true,
          installer: true,
          checklists: true,
          evidences: true
        }
      })
      
      if (!installation) return res.status(404).json({ success: false, error: 'Installation not found' })
      res.json({ success: true, data: installation })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get installation' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate work order folio if not provided
      if (!payload.workOrderId) {
        const count = await prisma.installation.count()
        const year = new Date().getFullYear()
        payload.workOrderId = `SX-OT-${year}-${String(count + 1).padStart(6, '0')}`
      }
      
      const created = await prisma.installation.create({ 
        data: payload,
        include: {
          project: true,
          client: true,
          installer: true
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create installation' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.installation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      const updated = await prisma.installation.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update installation' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }
      
      const existing = await prisma.installation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      const updateData: any = { status }
      
      // Set completion date if completed
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
      
      const updated = await prisma.installation.update({ 
        where: { id }, 
        data: updateData
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update installation status' })
    }
  },

  // Checklist Management
  updateChecklist: async (req: Request, res: Response) => {
    try {
      const { installationId } = req.params
      const { checklistItems } = req.body
      
      if (!checklistItems || !Array.isArray(checklistItems)) {
        return res.status(400).json({ success: false, error: 'Checklist items required' })
      }
      
      const installation = await prisma.installation.findUnique({ 
        where: { id: installationId } 
      })
      
      if (!installation) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      // Delete existing checklist items
      await prisma.installationChecklist.deleteMany({
        where: { installationId }
      })
      
      // Create new checklist items
      const createdItems = await prisma.installationChecklist.createMany({
        data: checklistItems.map((item: any) => ({
          ...item,
          installationId
        }))
      })
      
      res.json({ success: true, data: { created: createdItems.count } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update checklist' })
    }
  },

  getChecklist: async (req: Request, res: Response) => {
    try {
      const { installationId } = req.params
      
      const checklist = await prisma.installationChecklist.findMany({
        where: { installationId },
        orderBy: { createdAt: 'asc' }
      })
      
      res.json({ success: true, data: checklist })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get checklist' })
    }
  },

  // Evidence Management
  addEvidence: async (req: Request, res: Response) => {
    try {
      const { installationId } = req.params
      const payload = req.body
      
      const installation = await prisma.installation.findUnique({ 
        where: { id: installationId } 
      })
      
      if (!installation) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      const created = await prisma.installationEvidence.create({ 
        data: {
          ...payload,
          installationId
        }
      })
      
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to add evidence' })
    }
  },

  getEvidence: async (req: Request, res: Response) => {
    try {
      const { installationId } = req.params
      
      const evidence = await prisma.installationEvidence.findMany({
        where: { installationId },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: evidence })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get evidence' })
    }
  },

  deleteEvidence: async (req: Request, res: Response) => {
    try {
      const { evidenceId } = req.params
      const existing = await prisma.installationEvidence.findUnique({ where: { id: evidenceId } })
      if (!existing) return res.status(404).json({ success: false, error: 'Evidence not found' })
      await prisma.installationEvidence.delete({ where: { id: evidenceId } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete evidence' })
    }
  },

  // SmartFilm Electrical Info
  updateElectricalInfo: async (req: Request, res: Response) => {
    try {
      const { installationId } = req.params
      const payload = req.body
      
      const installation = await prisma.installation.findUnique({ 
        where: { id: installationId } 
      })
      
      if (!installation) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      const updated = await prisma.installation.update({ 
        where: { id: installationId }, 
        data: {
          electricalInfo: payload
        }
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update electrical info' })
    }
  },

  // Work Order PDF
  generateWorkOrderPDF: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const installation = await prisma.installation.findUnique({ 
        where: { id },
        include: {
          project: true,
          client: true,
          installer: true,
          checklist: true
        }
      })
      
      if (!installation) return res.status(404).json({ success: false, error: 'Installation not found' })
      
      // TODO: Implement PDF generation
      res.json({ 
        success: true, 
        message: 'Work order PDF generation not yet implemented',
        data: installation 
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to generate work order PDF' })
    }
  },

  updateSmartFilm: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const details = req.body

      const existing = await prisma.installation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Installation not found' })

      const updated = await prisma.installation.update({
        where: { id },
        data: { smartFilmDetails: details }
      })

      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update SmartFilm details' })
    }
  },

  updateSignatures: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { installer, client } = req.body

      const existing = await prisma.installation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Installation not found' })

      const current = (existing.signatures as any) || {}
      const updated = await prisma.installation.update({
        where: { id },
        data: { signatures: { ...current, installer, client } }
      })

      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update signatures' })
    }
  }
}