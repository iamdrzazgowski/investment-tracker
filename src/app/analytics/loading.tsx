import { AppShell } from '@/components/shared/app-shell';
import { PageHeader } from '@/components/shared/page-header';

function Block({ className = '' }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-xl bg-muted ${className}`}
        />
    );
}

export default function AnalyticsLoading() {
    return (
        <AppShell>
            <PageHeader eyebrow='Insights' title='Analytics' />

            <div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
                <Block className='h-24' />
                <Block className='h-24' />
                <Block className='h-24' />
                <Block className='h-24' />
            </div>

            <div className='mb-8 mt-px grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
                <Block className='h-24' />
                <Block className='h-24' />
                <Block className='h-24' />
                <Block className='h-24' />
            </div>

            <div className='mb-8'>
                <Block className='h-96' />
            </div>

            <div className='mb-8 grid gap-6 md:gap-8 lg:grid-cols-2'>
                <Block className='h-80' />
                <Block className='h-80' />
            </div>

            <Block className='h-80' />
        </AppShell>
    );
}
