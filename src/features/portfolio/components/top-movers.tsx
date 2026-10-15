'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR } from '@/lib/format';
import type { Category } from '@/lib/data';

export interface TopMoverItem {
    t: string;
    cat: Category;
    price: number;
    day: number;
}

type TopMover = TopMoverItem;

function Col({
    title,
    rows,
    emptyMessage,
    onSelect,
}: {
    title: string;
    rows: TopMover[];
    emptyMessage: string;
    onSelect: (ticker: string) => void;
}) {
    return (
        <div>
            <div className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                {title}
            </div>

            {rows.length === 0 ? (
                <div className='rounded-md border border-dashed border-border px-3 py-6 text-center text-[12.5px] text-muted-foreground'>
                    {emptyMessage}
                </div>
            ) : (
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
            )}
        </div>
    );
}

export function TopMovers({ movers }: { movers: TopMoverItem[] }) {
    const router = useRouter();
    const sorted = movers.toSorted((a, b) => b.day - a.day);

    const gainers = sorted.filter((m) => m.day > 0).slice(0, 3);
    const losers = sorted
        .filter((m) => m.day < 0)
        .slice(-3)
        .reverse();

    if (movers.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top movers today</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='py-6 text-center text-sm text-muted-foreground'>
                        No market data yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top movers today</CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1'>
                <Col
                    title='Gainers'
                    rows={gainers}
                    emptyMessage='No gainers today.'
                    onSelect={(t) => router.push(`/asset/${t}`)}
                />
                <Col
                    title='Losers'
                    rows={losers}
                    emptyMessage='No losers today.'
                    onSelect={(t) => router.push(`/asset/${t}`)}
                />
            </CardContent>
        </Card>
    );
}
