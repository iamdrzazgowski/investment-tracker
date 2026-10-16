import type { Category } from '@/lib/data';

export function toCategory(category: string): Category {
    if (category === 'ETF') return 'ETFs';
    if (category === 'CRYPTO') return 'Crypto';
    return 'Stocks';
}
