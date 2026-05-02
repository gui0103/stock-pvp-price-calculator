# 📊 stock-pvp-price-calculator

API para calcular o **P/VP (Preço sobre Valor Patrimonial)** de ações e FIIs brasileiros, com cache inteligente via MongoDB e dados em tempo real via [Brapi](https://brapi.dev).

> API to calculate the **P/BV ratio (Price-to-Book Value)** of Brazilian stocks and REITs, with smart MongoDB caching and real-time market data powered by [Brapi](https://brapi.dev).

---

## 🧠 Como funciona / How it works

```
Request (ticker)
      │
      ▼
   Node.js
      │
      ├──► MongoDB ──► VP em cache válido? ──► Sim: usa o VP salvo
      │                                    └──► Não: chama a Brapi, salva e usa
      │
      ├──► Brapi (preço ao vivo, sempre)
      │
      └──► Calcula P/VP e retorna JSON
```

- O **Valor Patrimonial (VP)** é cacheado por 30 dias no MongoDB (dado estável).
- O **preço atual** é sempre buscado ao vivo na Brapi (dado volátil).
- O cálculo final **P/VP = Preço / VP** classifica o ativo automaticamente.

---

## 🗂️ Estrutura do projeto / Project Structure

```
pvp-api/
├── src/
│   ├── config/
│   │   └── db.js              # Conexão com MongoDB
│   ├── models/
│   │   └── Asset.js           # Schema do Mongoose (cache do VP)
│   ├── routes/
│   │   └── asset.js           # Rotas da API
│   ├── services/
│   │   ├── brapiService.js    # Chamadas à Brapi
│   │   └── pvpService.js      # Lógica de cache + cálculo P/VP
│   └── index.js               # Entry point
├── .env                       # Variáveis de ambiente (não commitar!)
├── .gitignore
├── biome.json                 # Configuração do Biome (lint + format)
└── package.json
```

---

## ⚙️ Pré-requisitos / Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker](https://www.docker.com) (recomendado para rodar o MongoDB)  
  **ou** [MongoDB](https://www.mongodb.com/try/download/community) instalado localmente
- Conta gratuita na [Brapi](https://brapi.dev) para obter o token da API

---

## 🚀 Como rodar localmente / Running locally

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/stock-pvp-price-calculator.git
cd stock-pvp-price-calculator/pvp-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `pvp-api/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/pvp_cache
BRAPI_TOKEN=seu_token_aqui
CACHE_DAYS=30
```

> Substitua `seu_token_aqui` pelo token da sua conta em [brapi.dev](https://brapi.dev).

### 4. Suba o MongoDB com Docker (recomendado)

```bash
docker run -d \
  --name pvp-mongo \
  -p 27017:27017 \
  mongo:7
```

> Se preferir usar o MongoDB instalado localmente, basta garantir que ele está rodando na porta `27017`.

### 5. Inicie o servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

Se tudo estiver certo, você verá:

```
✅ MongoDB conectado
🚀 Servidor rodando em http://localhost:3000
```

---

## 📡 Endpoints

### `GET /health`

Verifica se a API está no ar.

**Resposta:**
```json
{ "status": "ok" }
```

---

### `GET /api/asset/:ticker`

Retorna o P/VP calculado para o ativo informado.

| Parâmetro | Tipo   | Descrição                        |
|-----------|--------|----------------------------------|
| `ticker`  | string | Código do ativo (ex: `ALZR11`, `PETR4`) |

**Exemplo de requisição:**
```bash
curl http://localhost:3000/api/asset/ALZR11
```

**Exemplo de resposta:**
```json
{
  "ticker": "ALZR11",
  "currentPrice": 112.50,
  "bookValuePerShare": 130.20,
  "pvp": 0.8641,
  "classification": "🟡 Leve desconto",
  "bookValueFromCache": false,
  "calculatedAt": "2026-05-01T14:30:00.000Z"
}
```

### Tabela de classificação P/VP

| P/VP         | Classificação                    |
|--------------|----------------------------------|
| < 0.80       | 🟢 Com desconto significativo    |
| 0.80 – 0.99  | 🟡 Leve desconto                 |
| 1.00         | ⚪ No valor patrimonial          |
| 1.01 – 1.20  | 🟠 Negociando com prêmio                   |
| > 1.20       | 🔴 Cara (acima do VP)            |

---

## 🛠️ Scripts disponíveis / Available Scripts

```bash
npm run dev        # Inicia em modo desenvolvimento com nodemon
npm start          # Inicia em modo produção
npm run lint       # Verifica problemas de lint com Biome
npm run lint:fix   # Corrige problemas de lint automaticamente
npm run format     # Formata o código com Biome
npm run check      # Lint + format + organização de imports (recomendado)
```

---

## 🧰 Tecnologias / Tech Stack

| Tecnologia  | Função                                  |
|-------------|------------------------------------------|
| Node.js     | Runtime JavaScript                       |
| Express     | Framework HTTP                           |
| MongoDB     | Banco de dados / cache do VP             |
| Mongoose    | ODM para MongoDB                         |
| Axios       | Requisições HTTP para a Brapi            |
| Biome       | Linter e formatador de código            |
| Brapi       | Fonte de dados do mercado brasileiro     |

---

## 🐳 Docker (em breve / coming soon)

A containerização completa com `Dockerfile` e `docker-compose.yml` está planejada para a próxima etapa do projeto.
