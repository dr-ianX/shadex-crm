import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { User, AuthResponse } from '../types/api'

export type UseAuthReturn = {
  user: User | null
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles?: string[]) => boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(authService.getUser())

  useEffect(() => {
    // simple storage event sync
    const onStorage = () => setUser(authService.getUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password)
    setUser(authService.getUser())
    return data
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const hasRole = (roles: string[] = []) => {
    if (!user) return false
    return roles.includes(user.role || '')
  }

  return { user, login, logout, isAuthenticated, hasRole }
}
