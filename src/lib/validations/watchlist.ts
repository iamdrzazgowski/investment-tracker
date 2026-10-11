import { z } from 'zod';

export const watchlistTickerSchema = z.object({
    ticker: z
        .string()
        .trim()
        .min(1, 'Ticker is required')
        .max(20, 'Ticker is too long')
        .transform((v) => v.toUpperCase()),
});

export type WatchlistTickerInput = z.infer<typeof watchlistTickerSchema>;
