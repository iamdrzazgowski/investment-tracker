import type { Category } from '@/lib/data';

/** Pozycja z wartościami w walucie bazowej portfela. */
export interface AnalyticsHolding {
    t: string;
    cat: Category;
    value: number;
    invested: number;
    pl: number;
    plPct: number;
}
