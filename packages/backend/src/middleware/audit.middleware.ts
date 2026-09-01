import { Request, Response, NextFunction } from 'express'
import prisma from '../db'

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.json.bind(res)

  res.json = function (body: any) {
    if (res.statusCode < 400 && body?.success) {
      const path = req.path
      const match = path.match(/\/api\/v1\/([a-z-]+)(?:\/([a-zA-Z0-9_-]+))?/)
      const entity = match ? match[1] : 'unknown'
      const entityId = match ? match[2] : (req.body?.id || null)
      const user = (req as any).user

      if (user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        prisma.auditLog.create({
          data: {
            userId: user.userId,
            entity,
            entityId,
            action: req.method,
            oldValue: null,
            newValue: req.body ? JSON.stringify(req.body).slice(0, 2000) : null,
            ipAddress: req.ip
          }
        }).catch((err: any) => console.error('Audit log failed', err))
      }
    }
    return originalSend(body)
  }

  next()
}
