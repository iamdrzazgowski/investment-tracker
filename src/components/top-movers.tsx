'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/avatar-badge';
import { Delta } from '@/components/delta';
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

function Col({ title, rows }: { title: string; rows: TopMover[] }) {
    const router = useRouter();

    return (
        <div>
            <div className='mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground'>
                {title}
            </div>

            <ul className='divide-y divide-border'>
                {rows.map((h) => (
                    <li
                        key={h.t}
                        className='flex cursor-pointer items-center justify-between py-2 first:pt-0 last:pb-0'
                        onClick={() => router.push(`/asset/${h.t}`)}>
                        <div className='flex items-center gap-2.5'>
                            <AvatarBadge t={h.t} cat={h.cat} />

                            <div>
                                <div className='text-[13px] font-semibold'>
                                    {h.t}
                                </div>

                                <div className='text-[11.5px] text-muted-foreground'>
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
    const sorted = [...TOP_MOVERS].sort((a, b) => b.day - a.day);

    const gainers = sorted.slice(0, 3);
    const losers = sorted.slice(-3).reverse();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top movers today</CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-2 gap-5 pt-0'>
                <Col title='Gainers' rows={gainers} />
                <Col title='Losers' rows={losers} />
            </CardContent>
        </Card>
    );
}
