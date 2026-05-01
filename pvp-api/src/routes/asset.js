const express = require('express');
const router = express.Router();
const { calculatePVP } = require('../services/pvpService');

// GET /api/asset/:ticker
router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;

  if (!ticker || ticker.length < 5 || ticker.length > 7) {
    return res.status(400).json({ error: 'Ticker inválido. Ex: ALZR11, PETR4.' });
  }

  try {
    const result = await calculatePVP(ticker);
    return res.json(result);
  } catch (err) {
    console.error(`Erro ao processar ${ticker}:`, err.message);
    return res.status(502).json({
      error: 'Erro ao buscar dados do ativo.',
      detail: err.message,
    });
  }
});

module.exports = router;