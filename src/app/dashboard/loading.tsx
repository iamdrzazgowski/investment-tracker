import { AppShell } from '@/components/shared/app-shell';

function Block({ className = '' }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-xl bg-muted ${className}`}
        />
    );
}

export default function DashboardLoading() {
    return (
        <AppShell>
            <Block className='mb-3 h-4 w-32' />
            <Block className='mb-2 h-8 w-56' />
            <Block className='mb-5 h-10 w-72' />
            <div className='mb-5 grid grid-cols-2 gap-3 md:grid-cols-4'>
                <Block className='h-20' />
                <Block className='h-20' />
                <Block className='h-20' />
                <Block className='h-20' />
            </div>
            <Block className='mb-5 h-64' />
            <div className='grid gap-5 lg:grid-cols-[1.55fr_1fr]'>
                <Block className='h-72' />
                <Block className='h-72' />
            </div>
        </AppShell>
    );
}
