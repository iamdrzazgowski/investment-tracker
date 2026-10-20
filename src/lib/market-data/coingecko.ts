import 'server-only';
import type { Range } from './range';
import { RANGE_TO_COINGECKO_DAYS } from './range-config';

const BASE_URL = 'https://api.coingecko.com/api/v3';

/** Wszystkie krypto wyceniamy w USD (jak Yahoo dla `BTC-USD`). */
export const CRYPTO_CURRENCY = 'USD';

export interface CoinSearchHit {
    id: string;
    symbol: string;
    name: string;
    marketCapRank: number | null;
}

export interface CoinMarket {
    id: string;
    symbol: string;
    name: string;
    price: number | null;
    dayChangePercent: number | null;
    marketCapRank: number | null;
}

class CoinGeckoError extends Error {
    constructor(
        readonly status: number,
        path: string,
    ) {
        super(`CoinGecko ${status} for ${path}`);
    }
}

// Publiczne API CoinGecko ma bardzo niski limit (rzędu kilkunastu zapytań na
// minutę), więc: cache w pamięci procesu, deduplikacja równoległych zapytań
// i przerwa po 429 — w tym czasie serwujemy ostatnie dane albo błąd, bez
// dobijania się do limitu.
const MEMO_MAX_ENTRIES = 200;
const DEFAULT_COOLDOWN_SECONDS = 60;
const memo = new Map<string, { data: unknown; at: number }>();
const inflight = new Map<string, Promise<unknown>>();
let cooldownUntil = 0;

function remember(url: string, data: unknown) {
    if (memo.size >= MEMO_MAX_ENTRIES) {
        const oldest = memo.keys().next().value;
        if (oldest !== undefined) memo.delete(oldest);
    }
    memo.set(url, { data, at: Date.now() });
}

async function cgFetch<T>(
    path: string,
    params: Record<string, string>,
    revalidate: number,
): Promise<T> {
    const url = `${BASE_URL}${path}?${new URLSearchParams(params).toString()}`;
    const cached = memo.get(url);
    if (cached && Date.now() - cached.at < revalidate * 1000) {
        return cached.data as T;
    }

    if (Date.now() < cooldownUntil) {
        if (cached) return cached.data as T;
        throw new CoinGeckoError(429, path);
    }

    const pending = inflight.get(url);
    if (pending) return (await pending) as T;

    const headers: Record<string, string> = { accept: 'application/json' };
    // Opcjonalny klucz "Demo" — bez niego działa publiczny, mocno limitowany endpoint.
    if (process.env.COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const request = (async () => {
        const res = await fetch(url, { headers, next: { revalidate } });
        if (res.status === 429) {
            const retryAfter = Number(res.headers.get('retry-after'));
            cooldownUntil =
                Date.now() +
                (retryAfter > 0 ? retryAfter : DEFAULT_COOLDOWN_SECONDS) * 1000;
            if (cached) return cached.data;
        }
        if (!res.ok) throw new CoinGeckoError(res.status, path);

        const data: unknown = await res.json();
        remember(url, data);
        return data;
    })().finally(() => inflight.delete(url));

    inflight.set(url, request);
    return (await request) as T;
}

// Monety znane z wyszukiwania: strona aktywa nie musi pytać CoinGecko drugi raz.
const KNOWN_COIN_TTL_MS = 10 * 60 * 1000;
const knownCoins = new Map<string, { market: CoinMarket; at: number }>();

export function rememberCoinTicker(ticker: string, market: CoinMarket) {
    knownCoins.set(ticker.toUpperCase(), { market, at: Date.now() });
}

/**
 * Ticker w naszej bazie (`Asset.ticker` jest globalnie unikalny, a symbole
 * krypto kolidują z akcjami, np. SOL, i między sobą):
 * - "BTC-USD"                    — główna moneta o tym symbolu,
 * - "WBTC-WRAPPED-BITCOIN"       — każda kolejna moneta o tym samym symbolu.
 */
export function cryptoTicker(symbol: string, id: string, primary: boolean) {
    const s = symbol.trim().toUpperCase();
    return primary ? `${s}-USD` : `${s}-${id.toUpperCase()}`;
}

function byRank(a: CoinSearchHit, b: CoinSearchHit) {
    return (
        (a.marketCapRank ?? Number.POSITIVE_INFINITY) -
        (b.marketCapRank ?? Number.POSITIVE_INFINITY)
    );
}

/** Dla każdego symbolu zwraca id monety, która dostaje ticker "SYMBOL-USD". */
export function primaryCoinIdBySymbol(hits: CoinSearchHit[]) {
    const best = new Map<string, CoinSearchHit>();
    for (const hit of hits) {
        const key = hit.symbol.toUpperCase();
        const current = best.get(key);
        if (!current || byRank(hit, current) < 0) best.set(key, hit);
    }
    return new Map([...best].map(([symbol, hit]) => [symbol, hit.id]));
}

interface CoinMarketRow {
    id: string;
    symbol: string;
    name: string;
    current_price: number | null;
    price_change_percentage_24h: number | null;
    market_cap_rank: number | null;
}

function toCoinMarket(r: CoinMarketRow): CoinMarket {
    return {
        id: r.id,
        symbol: r.symbol,
        name: r.name,
        price: typeof r.current_price === 'number' ? r.current_price : null,
        dayChangePercent:
            typeof r.price_change_percentage_24h === 'number'
                ? r.price_change_percentage_24h
                : null,
        marketCapRank: r.market_cap_rank ?? null,
    };
}

export async function searchCoins(query: string): Promise<CoinSearchHit[]> {
    const data = await cgFetch<{
        coins?: {
            id: string;
            name: string;
            symbol: string;
            market_cap_rank: number | null;
        }[];
    }>('/search', { query }, 60);

    return (data.coins ?? []).map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        marketCapRank: c.market_cap_rank ?? null,
    }));
}

export async function fetchCoinMarkets(ids: string[]): Promise<CoinMarket[]> {
    if (ids.length === 0) return [];

    const rows = await cgFetch<CoinMarketRow[]>(
        '/coins/markets',
        {
            vs_currency: 'usd',
            ids: [...ids].sort().join(','),
            per_page: '250',
            sparkline: 'false',
        },
        60,
    );

    return rows.map(toCoinMarket);
}

/** Odwrotność `cryptoTicker` — używana, gdy ticker nie ma jeszcze rekordu w bazie. */
export async function resolveCoinByTicker(
    ticker: string,
): Promise<CoinMarket | null> {
    const upper = ticker.trim().toUpperCase();
    const dash = upper.indexOf('-');
    if (dash <= 0) return null;

    const known = knownCoins.get(upper);
    if (known && Date.now() - known.at < KNOWN_COIN_TTL_MS) {
        return known.market;
    }

    const symbol = upper.slice(0, dash);
    const rest = upper.slice(dash + 1);

    if (rest === 'USD') {
        // Jedno zapytanie: /coins/markets z `symbols` zwraca monety posortowane
        // malejąco po kapitalizacji, więc pierwsza to "główna" moneta o tym symbolu.
        const markets = await cgFetch<CoinMarketRow[]>(
            '/coins/markets',
            {
                vs_currency: 'usd',
                symbols: symbol.toLowerCase(),
                order: 'market_cap_desc',
                per_page: '10',
                sparkline: 'false',
            },
            60,
        );
        const match = markets.map(toCoinMarket).find(
            (m) => m.symbol.toUpperCase() === symbol,
        );
        return match ?? null;
    }

    const [market] = await fetchCoinMarkets([rest.toLowerCase()]);
    return market && market.symbol.toUpperCase() === symbol ? market : null;
}

export async function fetchCoinHistory(coinId: string, range: Range) {
    const request = (days: string) =>
        cgFetch<{ prices: [number, number][] }>(
            `/coins/${encodeURIComponent(coinId)}/market_chart`,
            { vs_currency: 'usd', days },
            60,
        );

    let data: { prices: [number, number][] };
    try {
        data = await request(RANGE_TO_COINGECKO_DAYS[range]);
    } catch (err) {
        // Darmowy plan ogranicza historię do 365 dni, więc "max" może zwrócić 4xx.
        if (RANGE_TO_COINGECKO_DAYS[range] !== 'max') throw err;
        data = await request('365');
    }

    return data.prices
        .filter(([, price]) => typeof price === 'number')
        .map(([t, price]) => ({ date: new Date(t), price }));
}
