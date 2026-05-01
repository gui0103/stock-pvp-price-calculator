const Asset = require('../models/Asset');
const { fetchAssetDetails, fetchCurrentPrice } = require('./brapiService');

const CACHE_DAYS = parseInt(process.env.CACHE_DAYS) || 30;

/**
 * Retorna o VP do cache ou busca na Brapi se necessário.
 */
const getBookValue = async (ticker) => {
  const cached = await Asset.findOne({ ticker });

  if (cached) {
    const ageInDays = (Date.now() - cached.lastFetchedAt) / (1000 * 60 * 60 * 24);

    if (ageInDays < CACHE_DAYS) {
      console.log(`📦 Cache HIT para ${ticker} (${Math.floor(ageInDays)} dias atrás)`);
      return { bookValue: cached.bookValuePerShare, fromCache: true };
    }

    console.log(`♻️  Cache EXPIRADO para ${ticker}, buscando na Brapi...`);
  } else {
    console.log(`🔍 Cache MISS para ${ticker}, buscando na Brapi...`);
  }

  // Busca na Brapi e salva/atualiza no MongoDB
  const bookValue = await fetchAssetDetails(ticker);

  await Asset.findOneAndUpdate(
    { ticker },
    { bookValuePerShare: bookValue, lastFetchedAt: new Date() },
    { upsert: true, new: true }
  );

  return { bookValue, fromCache: false };
};

/**
 * Calcula o P/VP e classifica o ativo.
 */
const calculatePVP = async (ticker) => {
  const upperTicker = ticker.toUpperCase();

  // Executa em paralelo: VP (cache/Brapi) + Preço atual (sempre ao vivo)
  const [{ bookValue, fromCache }, currentPrice] = await Promise.all([
    getBookValue(upperTicker),
    fetchCurrentPrice(upperTicker),
  ]);

  const pvp = parseFloat((currentPrice / bookValue).toFixed(4));

  // Classificação
  let classification;
  if (pvp < 0.8)       classification = '🟢 Com desconto significativo';
  else if (pvp < 1.0)  classification = '🟡 Leve desconto';
  else if (pvp === 1.0) classification = '⚪ No valor patrimonial';
  else if (pvp <= 1.2) classification = '🟠 Leve prêmio';
  else                  classification = '🔴 Cara (acima do VP)';

  return {
    ticker: upperTicker,
    currentPrice,
    bookValuePerShare: bookValue,
    pvp,
    classification,
    bookValueFromCache: fromCache,
    calculatedAt: new Date().toISOString(),
  };
};

module.exports = { calculatePVP };