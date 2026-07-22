// Simple smoke script: requires the backend server to be running
// Usage: node scripts/smoke.js

const PORT = process.env.PORT || 3001
const BASE = `http://localhost:${PORT}`

async function run() {
  try {
    console.log('Checking /health')
    const h = await fetch(`${BASE}/health`)
    console.log('/health', h.status)
    const health = await h.json()
    console.log('health:', health)

    console.log('Logging in as admin@shadex.local')
    const login = await fetch(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shadex.local', password: 'admin123' })
    })
    console.log('login status', login.status)
    const loginBody = await login.json()
    console.log('login body', loginBody)
    if (!loginBody.success) throw new Error('Login failed')
    const access = loginBody.data.accessToken || loginBody.data.token
    const refresh = loginBody.data.refreshToken || loginBody.data.refresh

    console.log('Access token length:', access ? access.length : 'no')

    console.log('Requesting protected quotations endpoint')
    const q = await fetch(`${BASE}/api/v1/quotations`, { headers: { Authorization: `Bearer ${access}` } })
    console.log('/api/v1/quotations status', q.status)
    const qBody = await q.json().catch(() => null)
    console.log('quotations body (or error):', qBody)

    // Try refresh
    if (refresh) {
      console.log('Testing refresh endpoint')
      const r = await fetch(`${BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh })
      })
      console.log('refresh status', r.status)
      console.log('refresh body', await r.json().catch(() => null))
    }

    console.log('Smoke tests finished')
  } catch (err) {
    console.error('Smoke test failed', err)
    process.exit(1)
  }
}

run()
