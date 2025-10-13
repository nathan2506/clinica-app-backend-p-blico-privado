const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

// 🛡️ Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 📦 Rotas
const reportsRoutes = require('./routes/reportsRoutes');
const telematicsRoutes = require('./routes/telematicsRoutes');
const reportStatsRoutes = require('./routes/reportStatsRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// 🚦 Uso das rotas
app.use('/api/reports', reportsRoutes);
app.use('/api/telematics', telematicsRoutes);
app.use('/api/reportStats', reportStatsRoutes); // 🔄 Corrigido para manter padrão /api
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 🚀 Inicialização do servidor apenas quando executado diretamente
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;

