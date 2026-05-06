# 📊 stock-pvp-price-calculator

A full-stack application to calculate the **P/BV ratio (Price-to-Book Value)** of Brazilian stocks and REITs (FIIs). Combines a Node.js API with MongoDB caching and a React/Vite frontend.

---

## 🧠 How it works

```
User types a ticker (e.g. ALZR11)
             │
             ▼
     React/Vite Frontend
             │
             ▼
     GET /api/asset/:ticker
             │
        Node.js API
             │
      ┌──────┴──────┐
      ▼             ▼
  MongoDB        Brapi API
 (VPA cache)  (live price)
      │             │
      └──────┬──────┘
             ▼
     P/BV = Price / VPA
             │
             ▼
    JSON response to UI
```

- **VPA (Book Value per Share)** is scraped from Status Invest and cached in MongoDB for 30 days.
- **Current price** is always fetched live from Brapi.
- The frontend displays the P/BV ratio with a color-coded classification.

---

## 🗂️ Project Structure

```
stock-pvp-price-calculator/
├── pvp-api/              → Node.js REST API
│   ├── src/
│   │   ├── config/       → MongoDB connection
│   │   ├── models/       → Mongoose schema (VPA cache)
│   │   ├── routes/       → API endpoints
│   │   ├── services/     → Business logic + scraping
│   │   └── index.js      → Entry point
│   └── .env              → API environment variables
│
├── pvp-front/            → React/Vite Frontend
│   ├── src/
│   │   ├── components/   → SearchBar, ResultCard, HistoryList, Loader
│   │   ├── hooks/        → useHistory (localStorage)
│   │   ├── App.jsx       → Main component
│   │   └── index.css     → Global styles
│   └── .env              → Frontend environment variables
│
├── package.json          → Root scripts (runs both projects)
└── README.md
```

---

## ⚙️ Prerequisites

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org) **v18+**
- [MongoDB Community](https://www.mongodb.com/try/download/community) running locally on port `27017`
- A free account at [Brapi](https://brapi.dev) to get your API token

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/seu-usuario/stock-pvp-price-calculator.git
cd stock-pvp-price-calculator
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install API dependencies

```bash
cd pvp-api
npm install
```

### 4. Configure the API environment

Create a `.env` file inside `pvp-api/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/pvp_cache
BRAPI_TOKEN=your_token_here
CACHE_DAYS=30
```

> Replace `your_token_here` with your token from [brapi.dev](https://brapi.dev).

### 5. Install frontend dependencies

```bash
cd ../pvp-front
npm install
```

### 6. Configure the frontend environment

Create a `.env` file inside `pvp-front/`:

```env
VITE_API_URL=http://localhost:3000
```

---

## ▶️ Running the project

### Option A — Single command (recommended)

From the **root** of the repository:

```bash
npm run dev
```

This starts both the API and the frontend simultaneously. You will see color-coded output:

```
[API]   ✅ MongoDB connected
[API]   🚀 Server running at http://localhost:3000
[FRONT] ➜  Local: http://localhost:5173
```

### Option B — Two separate terminals

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

## 🌐 Accessing the app

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Health check | http://localhost:3000/health |

---

## 📡 API Endpoints

### `GET /health`
Returns API status.

```json
{ "status": "ok" }
```

### `GET /api/asset/:ticker`
Returns P/BV ratio and classification for a given ticker.

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

## 🎨 P/BV Classification

| P/BV | Classification | Color |
|---|---|---|
| < 0.80 | Com desconto significativo | 🟢 Green |
| 0.80 – 0.99 | Leve desconto | 🟢 Light green |
| 1.00 | No valor patrimonial | ⚪ White |
| 1.01 – 1.20 | Negociando com prêmio | 🟠 Orange |
| > 1.20 | Cara (acima do VP) | 🔴 Red |

---

## 🧰 Tech Stack

| Technology | Role |
|---|---|
| Node.js + Express | REST API |
| MongoDB + Mongoose | VPA cache (30-day TTL) |
| Cheerio | HTML scraping (Status Invest) |
| Axios | HTTP requests |
| React 18 + Vite | Frontend |
| Biome | Linter & formatter |
| Brapi | Live stock price data |
| Status Invest | Book value (VPA) data source |
