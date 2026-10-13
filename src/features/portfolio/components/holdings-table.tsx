'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { fmtEUR, fmtNum, fmtSigned } from '@/lib/format';
import type { EnrichedHolding } from '@/lib/data';

export function HoldingsTable({
    rows,
    title = 'Holdings',
}: {
    rows: EnrichedHolding[];
    title?: string;
}) {
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                {rows.length === 0 ? (
                    <p className='py-6 text-center text-sm text-muted-foreground'>
                        No positions in this category yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead className='text-right'>
                                    Shares
                                </TableHead>
                                <TableHead className='text-right'>
                                    Price
                                </TableHead>
                                <TableHead className='text-right'>
                                    Avg. cost
                                </TableHead>
                                <TableHead className='text-right'>
                                    Value
                                </TableHead>
                                <TableHead className='text-right'>
                                    P/L
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((h) => (
                                <TableRow
                                    key={h.t}
                                    className='cursor-pointer'
                                    onClick={() =>
                                        router.push(`/asset/${h.t}`)
                                    }>
                                    <TableCell>
                                        <div className='flex items-center gap-2.5'>
                                            <AvatarBadge t={h.t} cat={h.cat} />
                                            <div>
                                                <div className='font-mono text-[13px] font-semibold'>
                                                    {h.t}
                                                </div>
                                                <div className='text-[12px] text-muted-foreground'>
                                                    {h.name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-right font-mono'>
                                        {fmtNum(
                                            h.shares,
                                            h.cat === 'Crypto' ? 3 : 0,
                                        )}
                                    </TableCell>
                                    <TableCell className='text-right font-mono'>
                                        {fmtEUR(h.price)}
                                    </TableCell>
                                    <TableCell className='text-right font-mono'>
                                        {fmtEUR(h.avg)}
                                    </TableCell>
                                    <TableCell className='text-right font-mono'>
                                        {fmtEUR(h.value)}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='font-mono'>
                                            {fmtSigned(h.pl)}
                                        </div>
                                        <Delta value={h.plPct} size='sm' />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
