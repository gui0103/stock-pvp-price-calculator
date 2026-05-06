# 📊 stock-pvp-price-calculator

Aplicação full-stack para calcular o **P/VP (Preço sobre Valor Patrimonial)** de ações e FIIs brasileiros. Combina uma API Node.js com cache em MongoDB e um frontend em React/Vite.

---

## 🧠 Como funciona

```
Usuário digita o ticker (ex: ALZR11)
             │
             ▼
     Frontend React/Vite
             │
             ▼
     GET /api/asset/:ticker
             │
        API Node.js
             │
      ┌──────┴──────┐
      ▼             ▼
   MongoDB        Brapi API
 (cache VPA)  (preço ao vivo)
      │             │
      └──────┬──────┘
             ▼
     P/VP = Preço / VPA
             │
             ▼
    Resposta JSON para o front
```

- O **VPA (Valor Patrimonial por Ação/Cota)** é coletado via scraping do Status Invest e cacheado no MongoDB por 30 dias.
- O **preço atual** é sempre buscado ao vivo na Brapi.
- O frontend exibe o P/VP com classificação colorida.

---

## 🗂️ Estrutura do projeto

```
stock-pvp-price-calculator/
├── pvp-api/              → API REST em Node.js
│   ├── src/
│   │   ├── config/       → Conexão com MongoDB
│   │   ├── models/       → Schema Mongoose (cache do VPA)
│   │   ├── routes/       → Endpoints da API
│   │   ├── services/     → Lógica de negócio + scraping
│   │   └── index.js      → Entry point
│   └── .env              → Variáveis de ambiente da API
│
├── pvp-front/            → Frontend React/Vite
│   ├── src/
│   │   ├── components/   → SearchBar, ResultCard, HistoryList, Loader
│   │   ├── hooks/        → useHistory (localStorage)
│   │   ├── App.jsx       → Componente principal
│   │   └── index.css     → Estilos globais
│   └── .env              → Variáveis de ambiente do frontend
│
├── package.json          → Scripts raiz (sobe os dois projetos)
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org) **v18+**
- [MongoDB Community](https://www.mongodb.com/try/download/community) rodando localmente na porta `27017`
- Conta gratuita na [Brapi](https://brapi.dev) para obter o token da API

---

## 🚀 Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/stock-pvp-price-calculator.git
cd stock-pvp-price-calculator
```

### 2. Instale as dependências da raiz

```bash
npm install
```

### 3. Instale as dependências da API

```bash
cd pvp-api
npm install
```

### 4. Configure as variáveis de ambiente da API

Crie um arquivo `.env` dentro de `pvp-api/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/pvp_cache
BRAPI_TOKEN=seu_token_aqui
CACHE_DAYS=30
```

> Substitua `seu_token_aqui` pelo token da sua conta em [brapi.dev](https://brapi.dev).

### 5. Instale as dependências do frontend

```bash
cd ../pvp-front
npm install
```

### 6. Configure as variáveis de ambiente do frontend

Crie um arquivo `.env` dentro de `pvp-front/`:

```env
VITE_API_URL=http://localhost:3000
```

---

## ▶️ Rodando o projeto

### Opção A — Comando único (recomendado)

Na **raiz** do repositório:

```bash
npm run dev
```

Isso inicia a API e o frontend simultaneamente. Você verá a saída colorida no terminal:

```
[API]   ✅ MongoDB conectado
[API]   🚀 Servidor rodando em http://localhost:3000
[FRONT] ➜  Local: http://localhost:5173
```

### Opção B — Dois terminais separados

**Terminal 1 — API:**
```bash
cd pvp-api
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd pvp-front
npm run dev
```

---

## 🌐 Acessando a aplicação

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Health check | http://localhost:3000/health |

---

## 📡 Endpoints da API

### `GET /health`
Verifica se a API está no ar.

```json
{ "status": "ok" }
```

### `GET /api/asset/:ticker`
Retorna o P/VP calculado para o ativo informado.

```bash
curl http://localhost:3000/api/asset/ALZR11
```

```json
{
  "ticker": "ALZR11",
  "currentPrice": 10.57,
  "bookValuePerShare": 10.59,
  "pvp": 0.9981,
  "classification": "Leve desconto",
  "bookValueFromCache": true,
  "calculatedAt": "2026-05-02T01:42:22.528Z"
}
```

---

## 🎨 Classificação P/VP

| P/VP | Classificação | Cor |
|---|---|---|
| < 0,80 | Com desconto significativo | 🟢 Verde |
| 0,80 – 0,99 | Leve desconto | 🟢 Verde claro |
| 1,00 | No valor patrimonial | ⚪ Branco |
| 1,01 – 1,20 | Negociando com prêmio | 🟠 Laranja |
| > 1,20 | Cara (acima do VP) | 🔴 Vermelho |

---

## 🧰 Tecnologias utilizadas

| Tecnologia | Função |
|---|---|
| Node.js + Express | API REST |
| MongoDB + Mongoose | Cache do VPA (30 dias) |
| Cheerio | Scraping HTML (Status Invest) |
| Axios | Requisições HTTP |
| React 18 + Vite | Frontend |
| Biome | Linter e formatador de código |
| Brapi | Dados de preço ao vivo |
| Status Invest | Fonte do VPA |

---

## 🐳 Docker (em breve)

A containerização completa com `Dockerfile` e `docker-compose.yml` cobrindo API, MongoDB e frontend está planejada para a próxima etapa do projeto.

---

## 📄 Licença

MIT
