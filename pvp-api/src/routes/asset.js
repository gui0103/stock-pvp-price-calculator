const express = require('express');
const router = express.Router();
const { calculatePVP } = require('../services/pvpService');

const axios = require('axios');
const cheerio = require('cheerio');

// Rota temporária de debug — remover depois
router.get('/debug/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toLowerCase();
  const url = `https://statusinvest.com.br/fundos-imobiliarios/${ticker}`;

  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });

  const $ = cheerio.load(html);

  // Extrai todos os blocos de indicadores que encontrar
  const indicators = [];
  $('div.info, div.item, div[class*="indicator"]').each((_, el) => {
    const title = $(el).find('span.title, h3, label, span').first().text().trim();
    const value = $(el).find('strong, span.value').first().text().trim();
    if (title && value) {
      indicators.push({ title, value });
    }
  });

  res.json({ url, total: indicators.length, indicators });
});

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