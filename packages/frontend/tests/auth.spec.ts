import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@shadex.local'
const ADMIN_PASS = 'admin123'

test('login flow and protected page', async ({ page, request }) => {
  // Instead of relying on the UI form (which may vary), authenticate via backend API
  // and store tokens directly in localStorage so we can validate the protected UI.
  // This keeps the test resilient to minor label/localization changes.
  await page.goto('/')

  // Perform API login from the Node/test context (request fixture) to avoid browser fetch/CORS differences,
  // then inject tokens into the page before navigating.
  const r = await request.post('http://localhost:3001/api/v1/auth/login', {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASS }
  })
  const resp = await r.json()
  if (!resp || !resp.success) throw new Error('API login failed in test: ' + JSON.stringify(resp))

  // Inject tokens into the page's localStorage before navigation
  await page.addInitScript((data) => {
    localStorage.setItem('shadex_access', data.accessToken)
    localStorage.setItem('shadex_refresh', data.refreshToken)
    localStorage.setItem('shadex_user', JSON.stringify(data.user))
  }, { accessToken: resp.data.accessToken, refreshToken: resp.data.refreshToken, user: resp.data.user })

  // Navigate to home and ensure protected UI appears
  await page.goto('/')
  await page.waitForURL('**/')

  // Check header contains user name or logout button (or user token present)
  const hasLogout = await page.getByRole('button', { name: /logout|salir|Cerrar sesión/i }).count()
  const hasName = await page.getByText(/Admin|admin@shadex.local/i).count()
  expect(hasLogout + hasName).toBeGreaterThan(0)

  // Try to navigate to protected route (quotations)
  await page.goto('/quotations')
  await expect(page).toHaveURL(/quotations/)

  // Expect list header or 'Nueva Cotización' button
  await expect(page.locator('text=Nueva Cotización')).toBeVisible({ timeout: 5000 })
})
