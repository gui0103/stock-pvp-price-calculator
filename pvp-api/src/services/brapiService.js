const axios = require('axios');
const cheerio = require('cheerio');

const BRAPI_BASE = 'https://brapi.dev/api';
const STATUS_INVEST_BASE = 'https://statusinvest.com.br';

/**
 * Detecta se o ticker é FII (termina com 2 números) ou ação.
 * Ex: ALZR11 → FII | PETR4 → Ação
 */
const isFII = (ticker) => /\d{2}$/.test(ticker);

/**
 * Busca o VPA (Valor Patrimonial por Ação/Cota) no Status Invest.
 * FII  → categoria: fundos-imobiliarios → campo: "val. patrim. p/cota"
 * Ação → categoria: acoes              → campo: "vpa"
 */
const fetchBookValueFromStatusInvest = async (ticker) => {
  const category = isFII(ticker) ? 'fundos-imobiliarios' : 'acoes';
  const url = `${STATUS_INVEST_BASE}/${category}/${ticker.toLowerCase()}`;

  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
    timeout: 10000,
  });

  const $ = cheerio.load(html);

  let bookValue = null;

  $('div.info, div.item, div[class*="indicator"]').each((_, el) => {
    const title = $(el).find('span.title, h3, label, span').first().text().trim().toLowerCase();
    const value = $(el).find('strong, span.value').first().text().trim();

    // FII  → "val. patrim. p/cota"
    // Ação → "vpa"
    if (title.includes('val. patrim. p/cota') || title === 'vpa') {
      const parsed = parseFloat(value.replace('.', '').replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) {
        bookValue = parsed;
        return false; // break
      }
    }
  });

  if (!bookValue) {
    throw new Error(
      `VPA não encontrado no Status Invest para "${ticker}". Verifique se o ticker é válido.`
    );
  }

  return bookValue;
};

/**
 * Busca apenas o preço atual via Brapi (dado volátil, nunca cacheado).
 */
const fetchCurrentPrice = async (ticker) => {
  const { data } = await axios.get(`${BRAPI_BASE}/quote/${ticker}`, {
    params: { token: process.env.BRAPI_TOKEN },
  });

  const result = data?.results?.[0];
  if (!result) throw new Error(`Ticker "${ticker}" não encontrado na Brapi.`);

  const price = result.regularMarketPrice;
  if (!price || price <= 0) throw new Error(`Preço atual não disponível para "${ticker}".`);

  return price;
};

module.exports = { fetchBookValueFromStatusInvest, fetchCurrentPrice };