'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR } from '@/lib/format';

const TOP_MOVERS = [
    {
        t: 'BTC',
        cat: 'Crypto' as const,
        price: 61200,
        day: 3.62,
    },
    {
        t: 'NVDA',
        cat: 'Stocks' as const,
        price: 138.75,
        day: 2.14,
    },
    {
        t: 'ETH',
        cat: 'Crypto' as const,
        price: 3380,
        day: 1.95,
    },
    {
        t: 'NFLX',
        cat: 'Stocks' as const,
        price: 940.55,
        day: -1.24,
    },
    {
        t: 'META',
        cat: 'Stocks' as const,
        price: 612.8,
        day: -0.68,
    },
    {
        t: 'MSFT',
        cat: 'Stocks' as const,
        price: 428.9,
        day: -0.32,
    },
];

type TopMover = (typeof TOP_MOVERS)[number];

function Col({
    title,
    rows,
    onSelect,
}: {
    title: string;
    rows: TopMover[];
    onSelect: (ticker: string) => void;
}) {
    return (
        <div>
            <div className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                {title}
            </div>

            <ul className='divide-y divide-border'>
                {rows.map((h) => (
                    <li
                        key={h.t}
                        className='-mx-2 flex cursor-pointer items-center justify-between rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-muted/60'
                        onClick={() => onSelect(h.t)}>
                        <div className='flex items-center gap-2.5'>
                            <AvatarBadge t={h.t} cat={h.cat} />

                            <div>
                                <div className='font-mono text-[13px] font-semibold'>
                                    {h.t}
                                </div>

                                <div className='font-mono text-[11.5px] text-muted-foreground'>
                                    {fmtEUR(h.price)}
                                </div>
                            </div>
                        </div>

                        <Delta value={h.day} size='sm' />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function TopMovers() {
    const router = useRouter();
    const sorted = TOP_MOVERS.toSorted((a, b) => b.day - a.day);

    const gainers = sorted.slice(0, 3);
    const losers = sorted.slice(-3).reverse();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top movers today</CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1'>
                <Col
                    title='Gainers'
                    rows={gainers}
                    onSelect={(t) => router.push(`/asset/${t}`)}
                />
                <Col
                    title='Losers'
                    rows={losers}
                    onSelect={(t) => router.push(`/asset/${t}`)}
                />
            </CardContent>
        </Card>
    );
}
