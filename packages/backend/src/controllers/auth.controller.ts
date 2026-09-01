import { Request, Response } from 'express'
import prisma from '../db'
import bcrypt from 'bcryptjs'
import { generateTokensForUser, verifyRefreshToken, rotateRefreshToken, revokeRefreshToken } from '../services/token.service'

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ success: false, error: 'Missing credentials' })
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' })
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' })

      const tokens = await generateTokensForUser({ id: user.id, email: user.email, role: user.role })
      res.json({ success: true, data: { accessToken: tokens.access, refreshToken: tokens.refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: 'Login failed' })
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) return res.status(400).json({ success: false, error: 'Missing refreshToken' })
      const verified = await verifyRefreshToken(refreshToken)
      const newRefresh = rotateRefreshToken(refreshToken, verified.userId)
      const user = await prisma.user.findUnique({ where: { id: verified.userId } })
      if (!user) return res.status(401).json({ success: false, error: 'User not found' })
      const tokens = generateTokensForUser({ id: user.id, email: user.email, role: user.role })
      res.json({ success: true, data: { accessToken: tokens.access, refreshToken: tokens.refresh } })
    } catch (err: any) {
      console.error('Refresh failed', err && err.message ? err.message : err)
      return res.status(401).json({ success: false, error: 'Invalid refresh token' })
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) return res.status(400).json({ success: false, error: 'Missing refreshToken' })
      await verifyRefreshToken(refreshToken)
      res.json({ success: true })
    } catch (err) {
      console.error('Logout failed', err)
      return res.status(200).json({ success: true })
    }
  },

  changePassword: async (req: Request & { user?: { userId: string, role: string, email?: string } }, res: Response) => {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })
      const { currentPassword, newPassword } = req.body
      if (!currentPassword || !newPassword) return res.status(400).json({ success: false, error: 'Missing passwords' })
      if (newPassword.length < 6) return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' })

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })

      const ok = await bcrypt.compare(currentPassword, user.password)
      if (!ok) return res.status(401).json({ success: false, error: 'Current password is incorrect' })

      const hashed = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

      res.json({ success: true })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: 'Failed to change password' })
    }
  }
}
