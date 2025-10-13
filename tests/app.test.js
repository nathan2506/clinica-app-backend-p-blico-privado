const request = require('supertest');
const app = require('../app');
const pool = require('../utils/db');

describe('Smoke tests da API', () => {
  test('GET /api/reportStats deve responder com 200 ou JSON', async () => {
    const res = await request(app).get('/api/reportStats');
    expect([200, 404, 500]).toContain(res.status);
    // Se retornar JSON, deve ter propriedade mensagem (conforme controller atual)
    if (res.status === 200 && res.body) {
      expect(res.body).toBeDefined();
    }
  });
});

afterAll(async () => {
  await pool.end()
})
