const express = require('express');
const router = express.Router();
const { gerarEstatisticas } = require('../controllers/reportStatsController');

router.get('/', gerarEstatisticas);

module.exports = router;
