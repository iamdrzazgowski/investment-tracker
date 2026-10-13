'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavActive, NAV } from '@/components/shared/nav-items';
import { NordwellLogo } from '@/components/shared/nordwell-logo';

/** Slim brand bar for mobile. Navigation and search live in <MobileNav />. */
export function MobileHeader() {
    const pathname = usePathname();
    const current = NAV.find((n) => isNavActive(pathname, n.href));

    return (
        <header className='sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden'>
            <Link href='/dashboard' aria-label='Nordwell — dashboard'>
                <NordwellLogo />
            </Link>
            {current && (
                <span className='font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                    {current.label}
                </span>
            )}
        </header>
    );
}
