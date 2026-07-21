import { Request, Response } from 'express'
import prisma from '../db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!'

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ success: false, error: 'Missing credentials' })
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' })
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' })
      // jwt.sign typing can be strict in TS — cast to any to avoid overload issues
      const token = (jwt as any).sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET as any, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any)
      res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: 'Login failed' })
    }
  }
}
