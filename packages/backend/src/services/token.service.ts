import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!'
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '365d'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'replace-with-a-longer-random-string-ChangeMeNow!'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '365d'

export interface AccessPayload {
  userId: string
  role: string
  email?: string
}

export const generateAccessToken = (payload: AccessPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any })
}

export const verifyRefreshToken = (token: string) => {
  const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string }
  return { userId: payload.userId }
}

export const rotateRefreshToken = (token: string, _userId: string) => {
  const verified = verifyRefreshToken(token)
  return generateRefreshToken(verified.userId)
}

export const revokeRefreshToken = (_tokenId: string) => {
  // No persistence for refresh tokens in this simplified setup
  return Promise.resolve()
}

export const generateTokensForUser = (user: { id: string, email?: string, role?: string }) => {
  const access = generateAccessToken({ userId: user.id, role: user.role || 'User', email: user.email })
  const refresh = generateRefreshToken(user.id)
  return { access, refresh }
}