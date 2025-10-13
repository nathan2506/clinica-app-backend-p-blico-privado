const express = require('express');
const router = express.Router();

// Rotas de usuário (placeholder)
router.get('/', (req, res) => res.status(200).json({ mensagem: 'User routes working' }));

module.exports = router;
