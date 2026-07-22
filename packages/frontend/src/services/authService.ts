import axios from 'axios'

const ACCESS_KEY = 'shadex_access'
const REFRESH_KEY = 'shadex_refresh'
const USER_KEY = 'shadex_user'

function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}
function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(ACCESS_KEY, token)
  else localStorage.removeItem(ACCESS_KEY)
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}
function setRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token)
  else localStorage.removeItem(REFRESH_KEY)
}
function getUser() {
  const v = localStorage.getItem(USER_KEY)
  return v ? JSON.parse(v) : null
}
function setUser(u: any | null) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
  else localStorage.removeItem(USER_KEY)
}

export const authService = {
  async login(email: string, password: string) {
    const res = await axios.post('/api/v1/auth/login', { email, password })
    if (res.data && res.data.success) {
      const data = res.data.data
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
    const headers = new Headers(init?.headers as any || {})
    if (token) headers.set('Authorization', `Bearer ${token}`)
    try {
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
          const headers2 = new Headers(init?.headers as any || {})
          headers2.set('Authorization', `Bearer ${getAccessToken()}`)
          return fetch(input, { ...init, headers: headers2 })
        }
      }
      // refresh failed
      this.logout()
      return r
    } catch (err) {
      throw err
    }
  }
}
