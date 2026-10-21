# Nordwell — Investment Tracker

A multi-asset portfolio tracker for **stocks, ETFs, crypto and cash**. Nordwell puts portfolio value, performance and history first, and leaves out everything that doesn't help you think long term.

Built with Next.js 16 (App Router), React 19, Prisma 7 and PostgreSQL. Market data comes from Yahoo Finance and CoinGecko.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Market data and background jobs](#market-data-and-background-jobs)
- [Authentication and route protection](#authentication-and-route-protection)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

---

## Features

- **Dashboard and portfolio overview.** Total value, invested capital, cash, P/L, allocation donut, category breakdown, top movers and recent transactions.
- **Multi-asset support.** Stocks and ETFs (Yahoo Finance) and cryptocurrencies (CoinGecko) in one portfolio.
- **Asset search.** Global search across the local catalogue, Yahoo Finance and CoinGecko, with results ranked by relevance.
- **Asset pages.** Price charts for `1D`, `1W`, `1M`, `3M`, `1Y` and `All`, plus a buy/sell panel.
- **Trading simulation.** Add funds, then buy and sell assets. Orders run in a single database transaction. Average cost is recalculated on buy, and an immutable transaction history is kept.
- **Multi-currency.** Assets are priced in their native currency. Cash lives in the portfolio's base currency and FX rates are applied server-side.
- **Watchlist.** Track assets you don't own, with sparklines.
- **Transactions.** Full order history.
- **Analytics.**
  - Time-weighted performance index that is not distorted by deposits or trades.
  - Comparison against a benchmark (iShares MSCI ACWI).
  - Monthly returns, category performance and ranked holdings.
- **Authentication.** Email and password via Better Auth. A portfolio is created automatically on sign-up.
- **Responsive UI.** Sidebar on desktop, tab bar on mobile. Design follows the Nordwell design system: Swiss/editorial, minimal, fintech.

## Tech stack

| Layer         | Technology                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, Server Actions, React Compiler)  |
| UI            | React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) on Base UI, Lucide icons |
| Charts        | [Recharts](https://recharts.org)                                               |
| Forms         | React Hook Form + Zod                                                          |
| Database      | PostgreSQL 17                                                                  |
| ORM           | [Prisma 7](https://www.prisma.io) with the `@prisma/adapter-pg` driver adapter |
| Auth          | [Better Auth](https://www.better-auth.com) with the Prisma adapter             |
| Market data   | [`yahoo-finance2`](https://github.com/gadicc/node-yahoo-finance2), [CoinGecko API](https://www.coingecko.com/en/api) |
| Runtime / PM  | [Bun](https://bun.sh) (`bun@1.3.11`)                                           |
| Hosting       | Vercel (including Cron Jobs)                                                   |

## Architecture

```mermaid
flowchart TD
    UI[Next.js pages and components] --> SA[Server Actions]
    UI --> API[API routes]
    SA --> REPO[Repositories]
    API --> REPO
    CRON[Vercel Cron] --> API
    REPO --> DB[(PostgreSQL)]
    REPO --> MD[Market data layer]
    MD --> YF[Yahoo Finance]
    MD --> CG[CoinGecko]
    PROXY[proxy.ts] --> AUTH[Better Auth]
    AUTH --> DB
```

- **Repositories** (`src/lib/repositories`) are the only layer that talks to Prisma.
- **Server Actions** (`src/actions`) validate input with Zod, resolve the authenticated portfolio, and call repositories.
- **Market data** (`src/lib/market-data`) wraps external providers with caching (`unstable_cache`), request deduplication and rate-limit handling.
- **Features** (`src/features`) hold domain-specific UI. Shared primitives live in `src/components`.

## Getting started

### Prerequisites

- [Bun](https://bun.sh) 1.3+
- [Docker](https://www.docker.com) (for the local PostgreSQL instance), or any PostgreSQL 14+ server

### 1. Install dependencies

```bash
bun install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL 17 on `localhost:5432` with the credentials defined in `compose.yml`.

### 3. Configure environment

Create a `.env` file in the project root (see [Environment variables](#environment-variables)):

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/investment_tracker"
BETTER_AUTH_SECRET="<random string, at least 32 characters>"
BETTER_AUTH_URL="http://localhost:3000"
CRON_SECRET="<random string>"
```

You can generate secrets with `openssl rand -base64 32`.

### 4. Generate the Prisma client and apply migrations

```bash
bun run prisma:generate
bunx prisma migrate deploy
```

The Prisma client is generated into `generated/prisma`.

### 5. Run the app

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, add funds and start building a portfolio.

### 6. (Optional) Populate prices locally

Asset prices are refreshed by cron jobs in production. Locally you can trigger them manually:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-prices
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/snapshot-portfolios
```

Portfolio charts are built from snapshots, so they fill in over time.

## Environment variables

| Variable             | Required | Description                                                                                      |
| -------------------- | :------: | ------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`       |   Yes    | PostgreSQL connection string, used by the app and the Prisma CLI.                                |
| `BETTER_AUTH_SECRET` |   Yes    | Secret used by Better Auth to sign and encrypt sessions.                                         |
| `BETTER_AUTH_URL`    |   Yes    | Public base URL of the app (e.g. `http://localhost:3000` or your production domain).             |
| `CRON_SECRET`        |   Yes    | Bearer token that protects `/api/cron/*`. Vercel sends it automatically when it is set.          |
| `COINGECKO_API_KEY`  |    No    | CoinGecko "Demo" API key. Without it the heavily rate-limited public endpoint is used.           |

> `.env*` files are git-ignored. Never commit real secrets.

## Available scripts

| Command                   | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| `bun run dev`             | Start the development server.                                               |
| `bun run build`           | Create a production build.                                                  |
| `bun run start`           | Start the production server.                                                |
| `bun run lint`            | Run ESLint.                                                                 |
| `bun run prisma:generate` | Generate the Prisma client.                                                 |
| `bun run prisma:migrate`  | Create and apply a development migration (`prisma migrate dev --name init`). Pass a different name via `bunx prisma migrate dev --name <name>`. |
| `bun run db:clear`        | Delete **all** rows from every table. Refuses to run in production without `--force`. |

## Project structure

```text
.
├── prisma/
│   ├── schema.prisma          # Data model
│   └── migrations/            # SQL migrations
├── generated/prisma/          # Generated Prisma client (output of `prisma generate`)
├── scripts/
│   └── db-clear.ts            # Dev utility to wipe the database
├── src/
│   ├── actions/               # Server Actions (auth, portfolio, assets, watchlist)
│   ├── app/                   # App Router: pages, layouts, API routes
│   │   ├── (auth)/            # /login, /signup
│   │   ├── api/
│   │   │   ├── auth/          # Better Auth handler
│   │   │   ├── assets/search/ # Asset search endpoint
│   │   │   └── cron/          # sync-prices, snapshot-portfolios
│   │   ├── dashboard/  portfolio/  watchlist/
│   │   ├── transactions/  analytics/  settings/
│   │   └── asset/[ticker]/
│   ├── components/
│   │   ├── shared/            # App shell, navigation, search, etc.
│   │   └── ui/                # shadcn/ui primitives
│   ├── features/              # Domain UI: analytics, asset, auth, landing,
│   │                          #   portfolio, transactions, watchlist
│   ├── lib/
│   │   ├── analytics/         # Performance index, downsampling
│   │   ├── market-data/       # Yahoo, CoinGecko, FX, benchmark, ranges
│   │   ├── repositories/      # Data access layer (Prisma)
│   │   ├── validations/       # Zod schemas
│   │   ├── auth.ts            # Better Auth server config
│   │   └── prisma.ts          # Prisma client singleton
│   └── proxy.ts               # Route protection
├── compose.yml                # Local PostgreSQL
├── vercel.json                # Cron schedules
└── prisma.config.ts           # Prisma CLI configuration
```

## Data model

```mermaid
erDiagram
    User ||--o| Portfolio : has
    Portfolio ||--o{ Holding : owns
    Portfolio ||--o{ Transaction : places
    Portfolio ||--o{ WatchlistItem : watches
    Portfolio ||--o{ PortfolioSnapshot : "valued over time"
    Asset ||--o{ Holding : "held as"
    Asset ||--o{ Transaction : "traded as"
    Asset ||--o{ WatchlistItem : "watched as"
    Asset ||--o{ PriceSnapshot : "priced over time"
```

| Model               | Purpose                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `User`, `Session`, `Account`, `Verification` | Identity tables managed by Better Auth.                                  |
| `Portfolio`         | One per user. Holds `cashBalance` and `baseCurrency`. Kept separate from the identity tables. |
| `Asset`             | Shared market catalogue (`STOCK`, `ETF`, `CRYPTO`) with last price and daily change.          |
| `Holding`           | A user's position in an asset: shares and average cost. Unique per portfolio and asset.       |
| `Transaction`       | Immutable `BUY` / `SELL` history.                                                             |
| `WatchlistItem`     | Assets a user follows but does not own.                                                       |
| `PriceSnapshot`     | Price history of a single asset, written by the price sync job.                               |
| `PortfolioSnapshot` | Total, invested and cash value of a portfolio over time. Source for all performance charts.   |

Monetary values use `Decimal` columns. Share quantities use `Decimal(24, 8)` to support fractional crypto amounts.

## Market data and background jobs

**Providers**

- **Stocks and ETFs:** Yahoo Finance via `yahoo-finance2`. The same provider supplies FX rates (`EURUSD=X`-style pairs, cached for 1 hour) and the benchmark series.
- **Crypto:** CoinGecko, quoted in USD. Crypto tickers follow the `SYMBOL-USD` convention. When symbols collide, the lower-ranked coin gets a `SYMBOL-<COIN-ID>` ticker.

CoinGecko's public API is heavily rate-limited, so the client uses an in-memory cache, de-duplicates concurrent requests, and backs off after a `429`. Setting `COINGECKO_API_KEY` is recommended for anything beyond local development.

**Cron jobs** (defined in `vercel.json`, schedules are in UTC)

| Endpoint                          | Schedule                    | What it does                                                         |
| --------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `/api/cron/sync-prices`           | `*/15 9-17 * * 1-5`         | Refreshes prices for all assets and writes `PriceSnapshot` records.  |
| `/api/cron/snapshot-portfolios`   | `5 9-17 * * 1-5`            | Writes a `PortfolioSnapshot` for every portfolio.                    |

Both endpoints require `Authorization: Bearer <CRON_SECRET>`. Providers fail independently, so a CoinGecko outage does not block Yahoo updates.

**Performance index.** The analytics index starts at 100 and chains per-interval market returns (time-weighted return). Deposits and the act of buying or selling don't register as gains or losses.

## Authentication and route protection

- Email and password sign-in is handled by Better Auth, mounted at `/api/auth/*`.
- A `Portfolio` is created automatically through a Better Auth database hook when a user signs up.
- `src/proxy.ts` guards all routes except `/`, `/login` and `/signup`:
  - Unauthenticated page requests are redirected to `/login`.
  - Unauthenticated API requests receive a JSON `401` rather than an HTML redirect.
  - Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`.
- Server Actions resolve the current user's portfolio server-side, so clients never pass a portfolio ID.

## Deployment

The app is designed for [Vercel](https://vercel.com):

1. Provision a PostgreSQL database and set `DATABASE_URL`.
2. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your production URL), `CRON_SECRET` and, optionally, `COINGECKO_API_KEY`.
3. Make sure the Prisma client is generated during the build (for example with a `postinstall` or build step that runs `prisma generate`), and apply migrations with `bunx prisma migrate deploy`.
4. Deploy. Vercel registers the cron jobs from `vercel.json` automatically.

Note that sub-daily cron schedules require a Vercel plan that supports them.

## Known limitations

- The **Settings** page is currently a static placeholder. Its values (display currency, language, alerts, 2FA, statements) are not yet persisted or functional.
- Trading is a **simulation**. Orders execute at the displayed price against a virtual cash balance, with no brokerage integration.
- Cron schedules only cover weekday market hours (09:00–17:59 UTC), so crypto prices and portfolio snapshots are not recorded on weekends or overnight.
- CoinGecko's free tier limits history to 365 days, so the `All` range for crypto falls back to 1 year.
