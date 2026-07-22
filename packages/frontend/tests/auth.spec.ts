import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@shadex.local'
const ADMIN_PASS = 'admin123'

test('login flow and protected page', async ({ page }) => {
  // Go to the frontend app
  await page.goto('/')

  // Wait for login form
  await page.getByLabel('Email').fill(ADMIN_EMAIL)
  await page.getByLabel('Password').fill(ADMIN_PASS)
  await page.getByRole('button', { name: /iniciar sesión|login|sign in|Entrar/i }).click()

  // After login, expect redirect to home and presence of protected UI element
  await page.waitForURL('**/')

  // Check header contains user name or logout button
  const hasLogout = await page.getByRole('button', { name: /logout|salir|Cerrar sesión/i }).count()
  expect(hasLogout).toBeGreaterThan(0)

  // Try to navigate to protected route (quotations)
  await page.goto('/quotations')
  await expect(page).toHaveURL(/quotations/)

  // Expect list header or 'Nueva Cotización' button
  await expect(page.locator('text=Nueva Cotización')).toBeVisible({ timeout: 5000 })
})
