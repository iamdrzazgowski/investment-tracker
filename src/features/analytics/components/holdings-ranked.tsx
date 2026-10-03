'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import type { EnrichedHolding } from '@/lib/data';

export function HoldingsRanked({
    enriched,
}: {
    enriched: EnrichedHolding[];
}) {
    const router = useRouter();
    const sorted = enriched.toSorted((a, b) => b.plPct - a.plPct);
    let maxAbs = 1;
    for (const h of sorted) {
        const abs = Math.abs(h.plPct);
        if (abs > maxAbs) maxAbs = abs;
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Holdings ranked by return</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <ul className='divide-y divide-border'>
                    {sorted.map((h) => (
                        <li
                            key={h.t}
                            className='grid cursor-pointer grid-cols-[110px_1fr_74px] items-center gap-3 py-2.5 first:pt-0 last:pb-0'
                            onClick={() => router.push(`/asset/${h.t}`)}>
                            <div className='flex items-center gap-2'>
                                <AvatarBadge t={h.t} cat={h.cat} />
                                <span className='text-[13px] font-semibold'>
                                    {h.t}
                                </span>
                            </div>
                            <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                                <div
                                    className='h-full rounded-full'
                                    style={{
                                        width: `${(Math.abs(h.plPct) / maxAbs) * 100}%`,
                                        background:
                                            h.plPct >= 0
                                                ? 'var(--positive)'
                                                : 'var(--destructive)',
                                    }}
                                />
                            </div>
                            <Delta value={h.plPct} size='sm' />
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
