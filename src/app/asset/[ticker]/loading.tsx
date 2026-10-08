import { AppShell } from '@/components/shared/app-shell';

function Block({ className = '' }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-xl bg-muted ${className}`}
        />
    );
}

export default function AssetLoading() {
    return (
        <AppShell>
            <Block className='mb-4 h-5 w-24' />
            <div className='mb-5 flex items-center gap-3.5'>
                <Block className='h-11 w-11 rounded-full' />
                <div className='flex-1'>
                    <Block className='mb-2 h-5 w-44' />
                    <Block className='h-4 w-32' />
                </div>
                <Block className='h-7 w-24' />
            </div>
            <Block className='mb-5 h-64' />
            <div className='grid gap-5 md:grid-cols-2'>
                <Block className='h-64' />
                <Block className='h-64' />
            </div>
        </AppShell>
    );
}
