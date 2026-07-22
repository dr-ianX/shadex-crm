import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import prisma from '../db'

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!'
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'replace-with-a-longer-random-string-ChangeMeNow!'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'

export interface AccessPayload {
  userId: string
  role: string
  email?: string
}

export const generateAccessToken = (payload: AccessPayload) => {
  return (jwt as any).sign(payload, ACCESS_TOKEN_SECRET as any, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as any)
}

export const generateRefreshToken = async (userId: string) => {
  const tokenId = randomUUID()
  const payload = { userId, tokenId }
  const token = (jwt as any).sign(payload, REFRESH_TOKEN_SECRET as any, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any)
  const expiresAt = new Date(Date.now() + msFromJwtExp(REFRESH_TOKEN_EXPIRES_IN))
  const tokenHash = await bcrypt.hash(token, 10)
  // persist hashed token with tokenId so we can compare later (use any to avoid TS client mismatch until prisma client is regenerated)
  await (prisma as any).refreshToken.create({
    data: {
      tokenId,
      tokenHash,
      userId,
      expiresAt
    }
  })
  return token
}

// Helper: convert simple JWT expiresIn like "7d" or "15m" into ms. Supports: s, m, h, d
function msFromJwtExp(exp: string) {
  // exp is like '7d' or '15m' or '3600s'
  const match = /^(\d+)([smhd])$/.exec(exp)
  if (!match) return 7 * 24 * 60 * 60 * 1000
  const n = parseInt(match[1], 10)
  const unit = match[2]
  switch (unit) {
    case 's': return n * 1000
    case 'm': return n * 60 * 1000
    case 'h': return n * 60 * 60 * 1000
    case 'd': return n * 24 * 60 * 60 * 1000
    default: return n * 1000
  }
}

export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = (jwt as any).verify(token, REFRESH_TOKEN_SECRET as any) as { userId: string, tokenId: string }
    if (!payload || !payload.tokenId) throw new Error('Invalid refresh token payload')
    // find refresh token record by tokenId
    const record = await (prisma as any).refreshToken.findUnique({ where: { tokenId: payload.tokenId } })
    if (!record) throw new Error('Refresh token not found')
    if (record.revoked) throw new Error('Refresh token revoked')
    if (new Date(record.expiresAt) < new Date()) throw new Error('Refresh token expired')
    // compare raw token with stored hash
    const ok = await bcrypt.compare(token, record.tokenHash)
    if (!ok) throw new Error('Refresh token mismatch')
    return { userId: payload.userId, tokenId: payload.tokenId, record }
  } catch (err) {
    throw err
  }
}

export const rotateRefreshToken = async (oldTokenId: string, userId: string) => {
  // Mark old token revoked and create a new refresh token
  const newToken = await generateRefreshToken(userId)
  // find new token's tokenId from jwt
  const newPayload = (jwt as any).verify(newToken, REFRESH_TOKEN_SECRET as any) as { tokenId: string }
  // update previous record replacedById and revoked
  await (prisma as any).refreshToken.updateMany({ where: { tokenId: oldTokenId }, data: { revoked: true, replacedById: newPayload.tokenId } })
  return newToken
}

export const revokeRefreshToken = async (tokenId: string) => {
  await (prisma as any).refreshToken.updateMany({ where: { tokenId }, data: { revoked: true } })
}

export const generateTokensForUser = async (user: { id: string, email?: string, role?: string }) => {
  const access = generateAccessToken({ userId: user.id, role: user.role || 'User', email: user.email })
  const refresh = await generateRefreshToken(user.id)
  return { access, refresh }
}
