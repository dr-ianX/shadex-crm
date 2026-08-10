import axios from 'axios'
import { User, AuthResponse } from '../types/api'

// Set axios baseURL to backend API. Prefer Vite env VITE_API_URL, otherwise
// when running the preview on port 3000 (Playwright preview) point to localhost:3001.
const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.location.port === '3000' ? 'http://localhost:3001' : '')
if (API_BASE) axios.defaults.baseURL = API_BASE

const ACCESS_KEY = 'shadex_access'
const REFRESH_KEY = 'shadex_refresh'
const USER_KEY = 'shadex_user'

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}
function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(ACCESS_KEY, token)
  else localStorage.removeItem(ACCESS_KEY)
}
function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}
function setRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token)
  else localStorage.removeItem(REFRESH_KEY)
}
function getUser(): User | null {
  const v = localStorage.getItem(USER_KEY)
  return v ? (JSON.parse(v) as User) : null
}
function setUser(u: User | null) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
  else localStorage.removeItem(USER_KEY)
}


export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await axios.post('/api/v1/auth/login', { email, password })
    if (res.data && res.data.success) {
      const data = res.data.data as AuthResponse
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      return data
    }
    throw new Error(res.data?.error || 'Login failed')
  },
  logout() {
    // attempt server logout with refresh token
    const refresh = getRefreshToken()
    if (refresh) {
      axios.post('/api/v1/auth/logout', { refreshToken: refresh }).catch(() => {})
    }
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  },
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  setUser,

  // fetch wrapper that attempts refresh on 401
  async fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const token = getAccessToken()
    const headers = new Headers((init?.headers as HeadersInit) || {})
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const r = await fetch(input, { ...init, headers })
    if (r.status !== 401) return r
    // try refresh
    const refresh = getRefreshToken()
    if (!refresh) return r
    const rr = await fetch('/api/v1/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: refresh }) })
    if (rr.ok) {
      const body = await rr.json()
      if (body.success) {
        setAccessToken(body.data.accessToken)
        setRefreshToken(body.data.refreshToken)
        // retry original request
        const headers2 = new Headers((init?.headers as HeadersInit) || {})
        const newToken = getAccessToken()
        if (newToken) headers2.set('Authorization', `Bearer ${newToken}`)
        return fetch(input, { ...init, headers: headers2 })
      }
    }
    // refresh failed
    this.logout()
    return r
  }
}
