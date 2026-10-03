export const RANGES = ['1D', '1W', '1M', '3M', '1Y', 'All'] as const;
export type Range = (typeof RANGES)[number];
