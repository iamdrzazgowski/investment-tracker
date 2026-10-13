import type { ReactNode } from 'react';

export function PageHeader({
    eyebrow,
    title,
    action,
}: {
    eyebrow?: string;
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className='mb-8 flex items-end justify-between gap-4 md:mb-10'>
            <div className='min-w-0'>
                {eyebrow && (
                    <div className='mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        {eyebrow}
                    </div>
                )}
                <h1 className='text-[32px] font-semibold leading-none tracking-[-0.03em] md:text-[40px]'>
                    {title}
                </h1>
            </div>
            {action && <div className='shrink-0'>{action}</div>}
        </div>
    );
}
