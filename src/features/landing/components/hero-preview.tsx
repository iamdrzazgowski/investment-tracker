import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR, fmtNum, fmtSigned } from '@/lib/format';

const RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
const ACTIVE_RANGE = '1Y';

// Illustrative figures only. Holdings are a subset of the total.
const TOTAL = 42816.4;
const CHANGE_PCT = 12.48;
const CHANGE_ABS = 4750.6;

const HOLDINGS = [
    { t: 'AAPL', name: 'Apple Inc.', shares: 42, price: 231.5, day: 0.84 },
    { t: 'NVDA', name: 'NVIDIA Corp.', shares: 65, price: 138.75, day: 2.14 },
    { t: 'MSFT', name: 'Microsoft Corp.', shares: 18, price: 428.9, day: -0.32 },
];

const LINE =
    'M0,138 C30,134 52,120 82,124 C112,128 126,104 158,98 C190,92 206,108 238,92 C270,76 284,84 316,66 C348,48 366,58 398,40 C430,22 452,34 480,14';

/**
 * Static, decorative preview of the dashboard. Not interactive on purpose —
 * it is an illustration, so controls are plain text rather than buttons.
 */
export function HeroPreview() {
    return (
        <div
            role='img'
            aria-label='Preview of the Nordwell dashboard: portfolio value, a one-year chart and top holdings.'
            className='overflow-hidden rounded-xl border border-border bg-card'>
            <div className='p-5 md:p-6'>
                <div className='mb-5 flex items-start justify-between gap-4'>
                    <div className='font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        Portfolio value
                    </div>
                    <div
                        aria-hidden
                        className='hidden items-center gap-0.5 rounded-lg border border-border p-0.5 sm:inline-flex'>
                        {RANGES.map((r) => (
                            <span
                                key={r}
                                className={
                                    r === ACTIVE_RANGE
                                        ? 'rounded-md bg-primary px-2 py-1 font-mono text-[11px] font-medium text-primary-foreground'
                                        : 'rounded-md px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground'
                                }>
                                {r}
                            </span>
                        ))}
                    </div>
                </div>

                <div className='text-[40px] font-medium leading-none tracking-[-0.04em] tabular-nums md:text-[52px]'>
                    {fmtEUR(TOTAL)}
                </div>
                <div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1'>
                    <Delta value={CHANGE_PCT} />
                    <span className='font-mono text-[13px] text-muted-foreground'>
                        {fmtSigned(CHANGE_ABS)}
                    </span>
                </div>

                <svg
                    viewBox='0 0 480 150'
                    preserveAspectRatio='none'
                    aria-hidden
                    className='mt-6 h-32 w-full md:h-40'>
                    <defs>
                        <linearGradient id='landing-fill' x1='0' y1='0' x2='0' y2='1'>
                            <stop
                                offset='0%'
                                stopColor='var(--it-foreground)'
                                stopOpacity='0.08'
                            />
                            <stop
                                offset='100%'
                                stopColor='var(--it-foreground)'
                                stopOpacity='0'
                            />
                        </linearGradient>
                    </defs>
                    {[37, 75, 112].map((y) => (
                        <line
                            key={y}
                            x1='0'
                            x2='480'
                            y1={y}
                            y2={y}
                            stroke='var(--it-border)'
                            strokeWidth='1'
                            vectorEffect='non-scaling-stroke'
                        />
                    ))}
                    <path d={`${LINE} L480,150 L0,150 Z`} fill='url(#landing-fill)' />
                    <path
                        d={LINE}
                        fill='none'
                        stroke='var(--it-foreground)'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        vectorEffect='non-scaling-stroke'
                    />
                </svg>
            </div>

            <ul className='divide-y divide-border border-t border-border'>
                {HOLDINGS.map((h) => {
                    const value = h.shares * h.price;
                    return (
                        <li
                            key={h.t}
                            className='flex items-center justify-between gap-4 px-5 py-3.5 md:px-6'>
                            <div className='flex min-w-0 items-center gap-3'>
                                <AvatarBadge t={h.t} cat='Stocks' />
                                <div className='min-w-0'>
                                    <div className='font-mono text-[13px] font-semibold'>
                                        {h.t}
                                    </div>
                                    <div className='truncate text-[12px] text-muted-foreground'>
                                        {h.name} · {fmtNum(h.shares, 0)} shares
                                    </div>
                                </div>
                            </div>
                            <div className='shrink-0 text-right'>
                                <div className='font-mono text-[13px] font-semibold tabular-nums'>
                                    {fmtEUR(value)}
                                </div>
                                <Delta value={h.day} size='sm' />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
