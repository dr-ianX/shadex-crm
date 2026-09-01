import { Request, Response } from 'express'
import prisma from '../db'

export const companyController = {
  get: async (req: Request, res: Response) => {
    try {
      const company = await prisma.company.findFirst()
      res.json({ success: true, data: company })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get company' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const company = await prisma.company.findFirst()
      if (!company) return res.status(404).json({ success: false, error: 'Company not found' })

      const updated = await prisma.company.update({
        where: { id: company.id },
        data: req.body
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update company' })
    }
  }
}
