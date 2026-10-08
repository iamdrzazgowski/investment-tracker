'use client';

import Link from 'next/link';
import { AppShell } from '@/components/shared/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AssetError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <AppShell>
            <Card>
                <CardContent className='py-10 text-center'>
                    <p className='mb-1 text-sm font-semibold'>
                        Couldn&apos;t load this asset.
                    </p>
                    <p className='mb-4 text-[13px] text-muted-foreground'>
                        The ticker may be invalid or the quote service is down.
                    </p>
                    <div className='flex items-center justify-center gap-2'>
                        <Button onClick={reset}>Try again</Button>
                        <Link
                            href='/portfolio'
                            className='text-[13px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
                            Back to portfolio
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
