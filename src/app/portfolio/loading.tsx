import { AppShell } from '@/components/shared/app-shell';

function Block({ className = '' }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-xl bg-muted ${className}`}
        />
    );
}

export default function PortfolioLoading() {
    return (
        <AppShell>
            <Block className='mb-3 h-4 w-32' />
            <Block className='mb-5 h-8 w-48' />
            <Block className='mb-5 h-44' />
            <Block className='mb-4 h-10 w-72' />
            <Block className='h-96' />
        </AppShell>
    );
}
