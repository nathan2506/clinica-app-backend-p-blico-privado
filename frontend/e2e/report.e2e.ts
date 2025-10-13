import { test, expect } from '@playwright/test';

test('login and create full report via UI', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // navigate to login and authenticate
  await page.fill('input[name="email"]', 'admin@example.com')
  await page.fill('input[name="password"]', 'clinica123!')
  await page.click('button:has-text("Entrar")')

  // wait for dashboard
  await page.waitForURL('**/dashboard')

  // open new report modal
  await page.click('text=Novo Relatório')

  // fill fields (minimal selectors)
  await page.fill('input[type="date"]', '2025-10-08')
  await page.fill('input[placeholder="Unidade"]', 'Unidade E2E')
  await page.fill('input[aria-label="Total de atendimentos"]', '10')

  await page.click('button:has-text("Criar")')

  // expect new report present in the table
  await expect(page.locator('text=Unidade E2E')).toBeVisible()
})
