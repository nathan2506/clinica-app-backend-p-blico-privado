const express = require('express');
const router = express.Router();
const Relatorio = require('../models/relatorio');
router.post('/', async (req, res) => {
  try {
    await Relatorio.criarRelatorio(req.body);
    res.status(201).json({ mensagem: 'Relatório salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar relatório:', error);
    res.status(500).json({ error: 'Erro ao salvar relatório' });
  }
});


module.exports = router;
