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
      // rotation: create a new refresh token and revoke the previous
      const newRefresh = await rotateRefreshToken(verified.tokenId, verified.userId)
      // create new access token
      const user = await prisma.user.findUnique({ where: { id: verified.userId } })
      if (!user) return res.status(401).json({ success: false, error: 'User not found' })
      const tokens = await generateTokensForUser({ id: user.id, email: user.email, role: user.role })
      // Note: generateTokensForUser will create a new refresh token in DB; rotateRefreshToken already revoked the old and linked replacedBy
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
      // verify to obtain tokenId
      const verified = await verifyRefreshToken(refreshToken)
      await revokeRefreshToken(verified.tokenId)
      res.json({ success: true })
    } catch (err) {
      console.error('Logout failed', err)
      // still respond success to avoid leaking info
      return res.status(200).json({ success: true })
    }
  }
}
