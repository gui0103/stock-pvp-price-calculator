require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const assetRoutes = require('./routes/asset');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rotas de ativos
app.use('/api/asset', assetRoutes);

// Inicia servidor após conectar ao banco
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
});