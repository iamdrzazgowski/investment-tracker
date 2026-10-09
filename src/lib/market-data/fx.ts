import 'server-only';
import { unstable_cache } from 'next/cache';
import { yahooFinance } from './yahoo';

const FX_REVALIDATE_SECONDS = 3600;

function normalize(code: string): string {
    return code.trim().toUpperCase();
}

async function fetchFxRateUncached(from: string, to: string): Promise<number | null> {
    const f = normalize(from);
    const t = normalize(to);
    if (!f || !t) return null;
    if (f === t) return 1;

    // Yahoo convention: EURUSD=X, USDPLN=X, EURPLN=X, ...
    const direct = `${f}${t}=X`;
    try {
        const q = await yahooFinance.quote(direct);
        const rec = q as unknown as Record<string, unknown>;
        if (typeof rec?.regularMarketPrice === 'number' && rec.regularMarketPrice > 0) {
            return rec.regularMarketPrice as number;
        }
    } catch {
        // fall through to inverse pair
    }

    const inverse = `${t}${f}=X`;
    try {
        const q = await yahooFinance.quote(inverse);
        const rec = q as unknown as Record<string, unknown>;
        if (typeof rec?.regularMarketPrice === 'number' && (rec.regularMarketPrice as number) > 0) {
            return 1 / (rec.regularMarketPrice as number);
        }
    } catch {
        return null;
    }

    return null;
}

/**
 * FX rate to convert 1 unit of `from` currency into `to` currency.
 * Returns 1 for identical currencies, null when the rate is unavailable.
 * Cached for 1h — rates move slowly and this avoids a Yahoo call per render.
 */
export async function getFxRate(from: string, to: string): Promise<number | null> {
    const f = normalize(from);
    const t = normalize(to);
    if (f === t) return 1;

    const cached = unstable_cache(
        async () => fetchFxRateUncached(f, t),
        ['fx-rate', f, t],
        { revalidate: FX_REVALIDATE_SECONDS },
    );
    try {
        return await cached();
    } catch (err) {
        console.error(`FX rate ${f}->${t} failed:`, err);
        return null;
    }
}

/** Convert `amount` from one currency to another with a given rate. */
export function convertWithRate(amount: number, rate: number): number {
    return amount * rate;
}
