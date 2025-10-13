const request = require('supertest')
const app = require('../app')
const pool = require('../utils/db')

describe('Full report integration', () => {
  let agent = request.agent(app)

  test('login, create full report, verify it exists', async () => {
    // login
    const loginRes = await agent.post('/api/auth/login').send({ email: 'admin@example.com', password: 'clinica123!' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.user).toBeDefined()

    // create full report
    const payload = {
      report_date: '2025-10-08',
      unit: 'Unidade Teste Full',
      total_atendimentos: 30,
      total_indicacoes: 7,
      total_avaliacoes: 12,
      total_avaliacoes_convertidas: 5,
      total_reavaliacoes: 4,
      total_reavaliacoes_convertidas: 2,
      total_agendamentos_dia: 18,
      total_agendamentos_comparecidos: 16,
      total_tours: 3,
      contratos_recorrencia: 3,
      quitacao_carne_valor: 900.75,
      ortodontia_manutencoes: 6,
      ortodontia_convertidos_recorrencia: 2,
      vendas_planos_valor: 4200.5,
      renegociacoes_qtd: 3,
      renegociacoes_valor: 600.0,
      contas_recebidas: 4800.25
    }

    const createRes = await agent.post('/api/reports').send(payload)
    expect([200,201]).toContain(createRes.status)

    // list and find
    const listRes = await agent.get('/api/reports')
    expect(listRes.status).toBe(200)
    const found = listRes.body.data.find(r => r.unit === 'Unidade Teste Full' && Number(r.total_atendimentos) === 30)
    expect(found).toBeDefined()
  })
})

afterAll(async () => {
  await pool.end()
})
