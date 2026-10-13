'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavActive, NAV } from '@/components/shared/nav-items';
import { cn } from '@/lib/utils';
import { NordwellLogo } from '@/components/shared/nordwell-logo';

export function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className='sticky top-0 hidden h-screen w-58 shrink-0 flex-col border-r border-border bg-background px-4 py-6 md:flex'>
            <Link
                href='/dashboard'
                aria-label='Nordwell — dashboard'
                className='mb-10 block px-2'>
                <NordwellLogo />
            </Link>

            <nav aria-label='Main' className='flex flex-col gap-0.5'>
                {NAV.map((n) => {
                    const active = isNavActive(pathname, n.href);
                    const Icon = n.icon;
                    return (
                        <Link
                            key={n.href}
                            href={n.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground',
                                active &&
                                    'bg-muted font-semibold text-foreground',
                            )}>
                            <Icon size={16} strokeWidth={1.75} />
                            {n.label}
                        </Link>
                    );
                })}
            </nav>

            <div className='mt-auto flex items-center gap-3 border-t border-border px-2 pt-5'>
                <span className='flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card font-mono text-[11px] font-semibold'>
                    MK
                </span>
                <div className='min-w-0'>
                    <div className='truncate text-[13px] font-semibold'>
                        Marta K.
                    </div>
                    <div className='truncate text-[11.5px] text-muted-foreground'>
                        Personal account
                    </div>
                </div>
            </div>
        </aside>
    );
}
