import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!'

interface TokenPayload {
  userId: string
  role: string
  email?: string
}

export const authMiddleware = (req: Request & { user?: TokenPayload }, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Missing Authorization header' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request & { user?: TokenPayload }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Forbidden' })
    next()
  }
}
