import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
  ,
  test: {
    environment: 'jsdom',
    globals: true,
    // Rodar apenas testes do código fonte. Excluir e2e e node_modules para evitar
    // que Vitest execute arquivos do Playwright ou testes dentro de dependências.
    include: ['src/**/*.test.{js,ts,tsx}', 'src/**/*.spec.{js,ts,tsx}', 'src/**/__tests__/**'],
    exclude: ['**/e2e/**', 'playwright.config.*', '**/*.spec.e2e.*', 'node_modules/**']
  }
})
