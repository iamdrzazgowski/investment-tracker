'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR, fmtSigned } from '@/lib/format';
import { INITIAL_HOLDINGS } from '@/lib/data';

const PREVIEW_HOLDINGS = INITIAL_HOLDINGS.map((h) => {
    const value = h.shares * h.price;
    const invested = h.shares * h.avg;
    const pl = value - invested;
    const plPct = invested > 0 ? (pl / invested) * 100 : 0;
    return { ...h, value, pl, plPct };
})
    .toSorted((a, b) => b.value - a.value)
    .slice(0, 5);

export function HoldingsPreview() {
    const router = useRouter();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Holdings</CardTitle>
                <CardAction>
                    <Link
                        href='/portfolio'
                        className='text-[13px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
                        View all
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className='pt-0'>
                <ul className='divide-y divide-border'>
                    {PREVIEW_HOLDINGS.map((h) => (
                        <li
                            key={h.t}
                            className='-mx-2 flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors duration-150 hover:bg-muted/60'
                            onClick={() => router.push(`/asset/${h.t}`)}>
                            <div className='flex min-w-0 items-center gap-2.5'>
                                <AvatarBadge t={h.t} cat={h.cat} />
                                <div className='min-w-0'>
                                    <div className='font-mono text-[13px] font-semibold'>
                                        {h.t}
                                    </div>
                                    <div className='truncate text-[12px] text-muted-foreground'>
                                        {h.name}
                                    </div>
                                </div>
                            </div>
                            <div className='shrink-0 text-right'>
                                <div className='font-mono text-[13px] font-semibold tabular-nums'>
                                    {fmtEUR(h.value)}
                                </div>
                                <div className='mt-0.5 flex items-center justify-end gap-1.5'>
                                    <span className='font-mono text-[11.5px] text-muted-foreground'>
                                        {fmtSigned(h.pl)}
                                    </span>
                                    <Delta value={h.plPct} size='sm' />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
