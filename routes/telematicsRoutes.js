const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const { Parser } = require('json2csv');

// Rota GET para visualizar os dados de telemetria
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM telematics');
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar telemetria:', error);
    res.status(500).json({ error: 'Erro ao buscar telemetria' });
  }
});

// Rota GET para exportar CSV
router.get('/export/csv', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM telematics');
    const dados = resultado.rows;

    if (dados.length === 0) {
      return res.status(404).json({ error: 'Nenhum dado encontrado para exportar' });
    }

    const campos = Object.keys(dados[0]);
    const parser = new Parser({ fields: campos });
    const csv = parser.parse(dados);

    res.header('Content-Type', 'text/csv');
    res.attachment('telematics.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Erro ao exportar CSV' });
  }
});

module.exports = router;
