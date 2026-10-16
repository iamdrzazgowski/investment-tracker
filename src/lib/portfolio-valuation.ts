import 'server-only';
import { getFxRate } from '@/lib/market-data/fx';

interface DecimalLike {
    toNumber(): number;
}

export interface ValuationHolding {
    shares: DecimalLike;
    avgCost: DecimalLike;
    asset: {
        currency: string;
        lastPrice: DecimalLike | null;
        dayChangePercent: DecimalLike | null;
    };
}

export interface ValuationPortfolio {
    cashBalance: DecimalLike;
    baseCurrency: string;
    holdings: ValuationHolding[];
}

export interface ValuedPosition {
    /** Wartość rynkowa pozycji w walucie bazowej. */
    value: number;
    /** Koszt zakupu pozycji w walucie bazowej. */
    invested: number;
}

export interface PortfolioValuation {
    /** Równolegle do `portfolio.holdings`. */
    positions: ValuedPosition[];
    cashValue: number;
    holdingsValue: number;
    investedValue: number;
    totalValue: number;
    dayChangeValue: number;
}

/**
 * Wycenia cały portfel w `baseCurrency`.
 *
 * Holdings są w walucie aktywa, cash w walucie bazowej, więc każda pozycja
 * jest przeliczana FX-em asset.currency -> baseCurrency. Gdy aktywo nie ma
 * jeszcze `lastPrice`, pozycja jest wyceniana po `avgCost`.
 *
 * `strictFx: true` (domyślnie) rzuca błąd, gdy brakuje kursu — używane przez
 * snapshoty, żeby nie zapisać błędnej wartości. `strictFx: false` przyjmuje
 * kurs 1 — używane do wyświetlania, żeby awaria Yahoo nie psuła dashboardu.
 */
export async function valuePortfolio(
    portfolio: ValuationPortfolio,
    { strictFx = true }: { strictFx?: boolean } = {},
): Promise<PortfolioValuation> {
    const cashValue = portfolio.cashBalance.toNumber();
    const rates = new Map<string, number>();

    const currencies = new Set(portfolio.holdings.map((h) => h.asset.currency));
    await Promise.all(
        [...currencies].map(async (currency) => {
            const rate = await getFxRate(currency, portfolio.baseCurrency);
            if (rate == null || rate <= 0) {
                if (strictFx) {
                    throw new Error(
                        `Exchange rate unavailable for ${currency} to ${portfolio.baseCurrency}`,
                    );
                }
                rates.set(currency, 1);
                return;
            }
            rates.set(currency, rate);
        }),
    );

    let holdingsValue = 0;
    let investedValue = 0;
    let dayChangeValue = 0;
    const positions: ValuedPosition[] = [];

    for (const holding of portfolio.holdings) {
        const { asset } = holding;
        const rate = rates.get(asset.currency) ?? 1;
        const shares = holding.shares.toNumber();
        const avgCost = holding.avgCost.toNumber();
        const price = asset.lastPrice?.toNumber() ?? avgCost;

        const value = shares * price * rate;
        const invested = shares * avgCost * rate;
        positions.push({ value, invested });
        holdingsValue += value;
        investedValue += invested;

        const dayPct = asset.dayChangePercent?.toNumber() ?? 0;
        if (asset.lastPrice != null && 1 + dayPct / 100 > 0) {
            const previousPrice = price / (1 + dayPct / 100);
            dayChangeValue += shares * (price - previousPrice) * rate;
        }
    }

    return {
        positions,
        cashValue,
        holdingsValue,
        investedValue,
        totalValue: holdingsValue + cashValue,
        dayChangeValue,
    };
}
