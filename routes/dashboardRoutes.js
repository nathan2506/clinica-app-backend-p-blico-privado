const express = require('express');
const router = express.Router();

// Rotas de dashboard (placeholder)
router.get('/', (req, res) => res.status(200).json({ mensagem: 'Dashboard routes working' }));

module.exports = router;
