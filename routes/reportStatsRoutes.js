const express = require('express');
const router = express.Router();
const { gerarEstatisticas, gerarEstatisticasSemanais } = require('../controllers/reportStatsController');

router.get('/', gerarEstatisticas);
router.get('/weekly', gerarEstatisticasSemanais);

module.exports = router;
