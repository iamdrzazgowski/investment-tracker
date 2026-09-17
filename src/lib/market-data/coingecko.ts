import { RANGE_TO_COINGECKO_DAYS } from './range-config';
import type { Range } from '@/lib/data';

export async function fetchCoinGeckoQuote(id: string) {
    const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
        { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

    const data = await res.json();
    if (!data[id]) throw new Error(`Unknown CoinGecko id: ${id}`);

    return {
        price: data[id].usd as number,
        dayChangePercent: (data[id].usd_24h_change as number) ?? 0,
    };
}

export async function fetchCoinGeckoHistory(id: string, range: Range) {
    const days = RANGE_TO_COINGECKO_DAYS[range];
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    );
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

    const data = await res.json();
    return (data.prices as [number, number][]).map(([ts, price]) => ({
        date: new Date(ts),
        price,
    }));
}
