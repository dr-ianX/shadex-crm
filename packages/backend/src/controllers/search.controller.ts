import { Request, Response } from 'express'
import prisma from '../db'

export const searchController = {
  global: async (req: Request, res: Response) => {
    try {
      const { q } = req.query
      const searchTerm = (q as string) || ''
      
      if (!searchTerm || searchTerm.length < 2) {
        return res.json({ success: true, data: [] })
      }

      const whereLike = { contains: searchTerm, mode: 'insensitive' as const }

      const [clients, projects, quotations, warranties] = await Promise.all([
        prisma.client.findMany({
          where: {
            OR: [
              { name: whereLike },
              { lastName: whereLike },
              { email: whereLike },
              { phone: whereLike },
              { companyName: whereLike }
            ]
          },
          take: 5
        }),
        prisma.project.findMany({
          where: {
            OR: [
              { name: whereLike },
              { location: whereLike },
              { description: whereLike }
            ]
          },
          include: { client: true },
          take: 5
        }),
        prisma.quotation.findMany({
          where: {
            OR: [
              { folio: whereLike },
              { location: whereLike }
            ]
          },
          include: { client: true, project: true },
          take: 5
        }),
        prisma.warranty.findMany({
          where: {
            OR: [
              { warrantyId: whereLike },
              { qrCode: whereLike },
              { sku: whereLike }
            ]
          },
          include: { client: true, project: true },
          take: 5
        })
      ])

      const results = [
        ...clients.map((c: any) => ({ type: 'CLIENT', title: `${c.name} ${c.lastName || ''}`.trim(), subtitle: c.companyName || c.phone || c.email, id: c.id, path: `/clients/${c.id}` })),
        ...projects.map((p: any) => ({ type: 'PROJECT', title: p.name, subtitle: p.client?.name ? `${p.client.name} ${p.client.lastName || ''}` : p.location, id: p.id, path: `/projects/${p.id}` })),
        ...quotations.map((q: any) => ({ type: 'QUOTATION', title: q.folio, subtitle: q.project?.name || q.client?.name, id: q.id, path: `/quotations/${q.id}` })),
        ...warranties.map((w: any) => ({ type: 'WARRANTY', title: w.warrantyId, subtitle: w.project?.name || w.client?.name, id: w.id, path: `/warranties/${w.id}` }))
      ]

      res.json({ success: true, data: results })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Search failed' })
    }
  }
}
