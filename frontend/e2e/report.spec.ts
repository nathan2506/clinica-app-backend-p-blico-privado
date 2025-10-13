import { test, expect } from '@playwright/test';

test('login and create full report via UI', async ({ page, context, request }) => {
  // authenticate via backend API and forward cookie to browser context
  const loginRes = await request.post('http://127.0.0.1:3001/api/auth/login', { data: { email: 'admin@example.com', password: 'clinica123!' } })
  expect(loginRes.ok()).toBeTruthy()
  const raw = loginRes.headers()['set-cookie'] || ''
  const match = raw.match(/token=([^;]+)/)
  if (!match) throw new Error('No token cookie returned from API')
  const token = match[1]
  // add cookie for both localhost and 127.0.0.1 (some environments resolve differently)
  await context.addCookies([
    { name: 'token', value: token, domain: '127.0.0.1', path: '/' },
    { name: 'token', value: token, domain: 'localhost', path: '/' }
  ])

  // now navigate to reports page directly
  await page.goto('http://127.0.0.1:5173/reports')
  await page.waitForSelector('text=Relatórios', { timeout: 20000 })

  // open new report modal (button text)
  await page.click('text=Novo relatório')

  // fill fields using aria-label selectors
  await page.locator('input[aria-label="Data"]').fill('2025-10-08')
  await page.locator('input[aria-label="Unidade"]').fill('Unidade E2E')
  await page.locator('input[aria-label="Total de atendimentos"]').fill('10')

  await page.click('button:has-text("Criar")')

  // expect new report present in the table (use first() to avoid strict mode errors)
  await expect(page.locator('text=Unidade E2E').first()).toBeVisible()
})
