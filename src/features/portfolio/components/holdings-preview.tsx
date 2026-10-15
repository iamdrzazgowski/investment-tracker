'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR, fmtSigned } from '@/lib/format';
import type { Category } from '@/lib/data';

export interface HoldingPreviewItem {
    t: string;
    name: string;
    cat: Category;
    value: number;
    pl: number;
    plPct: number;
}

export function HoldingsPreview({ holdings }: { holdings: HoldingPreviewItem[] }) {
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
                {holdings.length === 0 ? (
                    <p className='py-6 text-center text-sm text-muted-foreground'>
                        No holdings yet. Place your first order from the
                        Portfolio page.
                    </p>
                ) : (
                    <ul className='divide-y divide-border'>
                        {holdings.map((h) => (
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
                )}
            </CardContent>
        </Card>
    );
}
