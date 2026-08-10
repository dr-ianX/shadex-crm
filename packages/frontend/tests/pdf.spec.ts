import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@shadex.local'
const ADMIN_PASS = 'admin123'

test('create quotation via API and fetch PDF', async ({ request }) => {
  // Login via API
  const login = await request.post('http://localhost:3001/api/v1/auth/login', {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASS }
  })
  const ljson = await login.json()
  expect(ljson.success).toBeTruthy()
  const access = ljson.data.accessToken

  // Create quotation
  const createResp = await request.post('http://localhost:3001/api/v1/quotations', {
    headers: { Authorization: `Bearer ${access}` },
    data: {
      notes: 'E2E test quotation',
      taxPercent: 16,
      lines: [ { description: 'Test item', quantity: 2, unitPrice: 120 } ]
    }
  })
  expect(createResp.status()).toBe(201)
  const created = await createResp.json()
  expect(created.success).toBeTruthy()
  const id = created.data.id

  // Request PDF
  const pdfResp = await request.get(`http://localhost:3001/api/v1/quotations/${id}/pdf`, {
    headers: { Authorization: `Bearer ${access}` }
  })
  expect(pdfResp.ok()).toBeTruthy()
  const ct = pdfResp.headers()['content-type'] || ''
  expect(ct).toContain('application/pdf')
})
