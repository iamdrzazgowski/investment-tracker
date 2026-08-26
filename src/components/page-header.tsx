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
        <div className='mb-5 flex items-end justify-between gap-3'>
            <div>
                {eyebrow && (
                    <div className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                        {eyebrow}
                    </div>
                )}
                <h1 className='text-xl font-bold tracking-tight md:text-[22px]'>
                    {title}
                </h1>
            </div>
            {action}
        </div>
    );
}
