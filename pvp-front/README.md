# 📊 pvp-front

Interface web para consulta do **P/VP (Preço sobre Valor Patrimonial)** de ações e FIIs brasileiros. Consome a API [`pvp-api`](../pvp-api) e exibe o resultado de forma visual e intuitiva.

> Web interface for querying the **P/BV ratio (Price-to-Book Value)** of Brazilian stocks and REITs.

---

## 🖥️ Preview

| Pesquisa | Resultado |
|---|---|
| Digite o ticker (ex: `ALZR11`) | P/VP com classificação colorida |

---

## 🧠 Como funciona / How it works

```
Usuário digita o ticker
        │
        ▼
   SearchBar (React)
        │
        ▼
  GET /api/asset/:ticker  ──►  pvp-api (Node.js)
        │
        ▼
   ResultCard exibe:
   • Preço atual
   • Valor Patrimonial (VPA)
   • P/VP calculado
   • Classificação colorida
```

---

## 🗂️ Estrutura do projeto / Project Structure

```
pvp-front/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx     # Input + botão de busca
│   │   ├── ResultCard.jsx    # Card com P/VP e classificação
│   │   └── Loader.jsx        # Indicador de carregamento
│   ├── App.jsx               # Componente principal + lógica de estado
│   ├── index.css             # Estilos globais
│   └── main.jsx              # Entry point
├── .env                      # Variáveis de ambiente (não commitar!)
├── .gitignore
├── biome.json                # Configuração do Biome (lint + format)
├── index.html
└── package.json
```

---

## ⚙️ Pré-requisitos / Prerequisites

- [Node.js](https://nodejs.org) v18+
- A API **pvp-api** rodando localmente na porta `3000`  
  → Veja o [README da API](../pvp-api/README.md) para instruções de setup

---

## 🚀 Como rodar localmente / Running locally

### 1. Clone o repositório (se ainda não fez)

```bash
git clone https://github.com/seu-usuario/stock-pvp-price-calculator.git
cd stock-pvp-price-calculator/pvp-front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `pvp-front/`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Certifique-se que a API está rodando

Em outro terminal, dentro de `pvp-api/`:

```bash
npm run dev
```

### 5. Inicie o frontend

```bash
npm run dev
```

Acesse **[http://localhost:5173](http://localhost:5173)**

---

## 🎨 Classificação P/VP

| P/VP | Classificação | Cor |
|---|---|---|
| < 0,80 | 🟢 Com desconto significativo | Verde |
| 0,80 – 0,99 | 🟡 Leve desconto | Amarelo |
| 1,00 | ⚪ No valor patrimonial | Branco |
| 1,01 – 1,20 | 🟠 Leve prêmio | Laranja |
| > 1,20 | 🔴 Cara (acima do VP) | Vermelho |

---

## 🛠️ Scripts disponíveis / Available Scripts

```bash
npm run dev        # Inicia em modo desenvolvimento
npm run build      # Gera build de produção em /dist
npm run preview    # Visualiza o build localmente
npm run lint       # Verifica problemas de lint com Biome
npm run format     # Formata o código com Biome
npm run check      # Lint + format + organização de imports
```

---

## 🧰 Tecnologias / Tech Stack

| Tecnologia | Função |
|---|---|
| React 18 | UI declarativa com hooks |
| Vite | Build tool e dev server |
| Axios | Requisições HTTP para a API |
| Biome | Linter e formatador de código |

---

## 📁 Repositório completo

Este projeto faz parte do monorepo **stock-pvp-price-calculator**:

```
stock-pvp-price-calculator/
├── pvp-api/     → API Node.js + MongoDB
└── pvp-front/   → Frontend React + Vite (este projeto)
```

---

## 🐳 Docker (em breve / coming soon)

A containerização completa com `docker-compose` cobrindo API, banco e frontend está planejada para a próxima etapa.