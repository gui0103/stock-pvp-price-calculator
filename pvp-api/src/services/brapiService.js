const axios = require('axios');

const BRAPI_BASE = 'https://brapi.dev/api';

/**
 * Busca dados completos do ativo (inclui VP/bookValue).
 * Usado quando o cache está expirado ou ausente.
 */
const fetchAssetDetails = async (ticker) => {
  const { data } = await axios.get(`${BRAPI_BASE}/quote/${ticker}`, {
    params: {
      token: process.env.BRAPI_TOKEN,
      fundamental: true,   // Necessário para retornar o bookValue
    },
  });

  const result = data?.results?.[0];
  if (!result) throw new Error(`Ticker "${ticker}" não encontrado na Brapi.`);

  // bookValue = VP por cota (valor patrimonial por ação)
  const bookValue = result.bookValue;
  if (!bookValue || bookValue <= 0) {
    throw new Error(`Valor patrimonial não disponível para "${ticker}".`);
  }

  return bookValue;
};

/**
 * Busca apenas o preço atual (dado volátil, não é cacheado).
 */
const fetchCurrentPrice = async (ticker) => {
  const { data } = await axios.get(`${BRAPI_BASE}/quote/${ticker}`, {
    params: {
      token: process.env.BRAPI_TOKEN,
    },
  });

  const result = data?.results?.[0];
  if (!result) throw new Error(`Ticker "${ticker}" não encontrado na Brapi.`);

  const price = result.regularMarketPrice;
  if (!price || price <= 0) {
    throw new Error(`Preço atual não disponível para "${ticker}".`);
  }

  return price;
};

module.exports = { fetchAssetDetails, fetchCurrentPrice };