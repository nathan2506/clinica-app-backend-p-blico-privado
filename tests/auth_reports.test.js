const request = require('supertest')
const app = require('../app')
const pool = require('../utils/db')

describe('Auth + Reports flow', () => {
  let agent = request.agent(app)

  test('login, create report, list reports', async () => {
    // login
    const loginRes = await agent.post('/api/auth/login').send({ email: 'admin@example.com', password: 'clinica123!' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.user).toBeDefined()

    // create
    const createRes = await agent.post('/api/reports').send({ report_date: '2025-10-08', unit: 'TestAgent', total_atendimentos: 5 })
    expect(createRes.status).toBe(201)

    // list
    const listRes = await agent.get('/api/reports')
    expect(listRes.status).toBe(200)
    expect(Array.isArray(listRes.body.data)).toBe(true)
  })
})

afterAll(async () => {
  await pool.end()
})
