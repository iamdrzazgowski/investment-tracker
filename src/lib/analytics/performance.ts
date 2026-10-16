export interface ValueSample {
    /** Unix ms */
    t: number;
    holdingsValue: number;
    investedValue: number;
    cashValue: number;
}

export interface IndexPoint {
    /** Unix ms */
    t: number;
    /** Indeks wyników inwestycji, start = 100. */
    v: number;
}

/**
 * Buduje indeks wyników portfela (start = 100), który NIE reaguje na wpłaty
 * ani na samo kupowanie/sprzedawanie — w przeciwieństwie do surowego
 * `totalValue`, gdzie wpłata 10k wyglądałaby jak +100% zysku.
 *
 * Dla kolejnych snapshotów liczymy zysk rynkowy między nimi:
 *   M = ΔholdingsValue − F
 * gdzie F to gotówka, która w tym przedziale przepłynęła do/z pozycji.
 * Transakcje są cash <-> holdings, więc gdy w przedziale była transakcja,
 * F = −ΔcashValue. Bez transakcji F = 0 (wpłata zmienia tylko gotówkę).
 * Stopa zwrotu przedziału to M / holdingsValue(poprzedni), łańcuchowana
 * (time-weighted return).
 *
 * Uproszczenie: wpłata w tym samym przedziale co transakcja zostanie
 * potraktowana jako część transakcji.
 */
export function buildPerformanceIndex(
    samples: ValueSample[],
    transactionTimes: number[],
): IndexPoint[] {
    const points: IndexPoint[] = [];
    let index = 100;
    let txCursor = 0;

    for (let i = 0; i < samples.length; i++) {
        const current = samples[i];

        if (i > 0) {
            const prev = samples[i - 1];
            while (
                txCursor < transactionTimes.length &&
                transactionTimes[txCursor] <= prev.t
            ) {
                txCursor++;
            }
            const hadTrade =
                txCursor < transactionTimes.length &&
                transactionTimes[txCursor] <= current.t;

            if (prev.holdingsValue > 0) {
                const flowIntoHoldings = hadTrade
                    ? -(current.cashValue - prev.cashValue)
                    : 0;
                const marketGain =
                    current.holdingsValue - prev.holdingsValue - flowIntoHoldings;
                const periodReturn = Math.max(
                    marketGain / prev.holdingsValue,
                    -0.99,
                );
                index *= 1 + periodReturn;
            }
        }

        points.push({ t: current.t, v: index });
    }

    return points;
}

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    timeZone: 'UTC',
});

export interface MonthlyReturn {
    m: string;
    /** Procent */
    r: number;
}

/** Zwroty kalendarzowych miesięcy (ostatnie `months`) z indeksu wyników. */
export function monthlyReturns(
    index: IndexPoint[],
    months = 6,
): MonthlyReturn[] {
    if (index.length < 2) return [];

    const lastByMonth = new Map<string, { t: number; v: number }>();
    for (const p of index) {
        const d = new Date(p.t);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2, '0')}`;
        lastByMonth.set(key, p);
    }

    const result: MonthlyReturn[] = [];
    let base = index[0].v;
    for (const point of lastByMonth.values()) {
        result.push({
            m: monthFormatter.format(point.t),
            r: base > 0 ? (point.v / base - 1) * 100 : 0,
        });
        base = point.v;
    }

    return result.slice(-months);
}
