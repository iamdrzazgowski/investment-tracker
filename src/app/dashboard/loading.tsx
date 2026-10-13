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
            <div className='mb-8 md:mb-10'>
                <Block className='mb-3 h-3 w-28' />
                <Block className='mb-4 h-11 w-64 md:h-16 md:w-96' />
                <Block className='h-4 w-40' />
            </div>
            <div className='space-y-6 md:space-y-8'>
                <Block className='h-96' />
                <div className='grid grid-cols-2 gap-px md:grid-cols-4'>
                    <Block className='h-28' />
                    <Block className='h-28' />
                    <Block className='h-28' />
                    <Block className='h-28' />
                </div>
                <div className='grid gap-6 md:gap-8 lg:grid-cols-[1.55fr_1fr]'>
                    <Block className='h-80' />
                    <Block className='h-80' />
                </div>
            </div>
        </AppShell>
    );
}
