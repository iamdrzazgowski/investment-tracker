'use client';

import { AppShell } from '@/components/shared/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardError({
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
                        Couldn&apos;t load the dashboard.
                    </p>
                    <p className='mb-4 text-[13px] text-muted-foreground'>
                        Check your connection and try again.
                    </p>
                    <Button onClick={reset}>Try again</Button>
                </CardContent>
            </Card>
        </AppShell>
    );
}
