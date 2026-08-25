'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/components/nav-items';
// import { SearchTrigger } from "@/components/global-search";
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className='sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card p-3.5 md:flex'>
            <div className='flex items-center gap-2.5 px-2.5 pb-4 pt-1'>
                <span className='flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-primary text-[13px] font-bold text-primary-foreground'>
                    N
                </span>
                <span className='text-[14.5px] font-semibold tracking-tight'>
                    Nordwell
                </span>
            </div>
            {/* <SearchTrigger variant="bar" /> */}
            <nav className='flex flex-col gap-0.5'>
                {NAV.map((n) => {
                    const active =
                        pathname === n.href ||
                        (n.href !== '/' && pathname.startsWith(n.href));
                    const Icon = n.icon;
                    return (
                        <Link
                            key={n.href}
                            href={n.href}
                            className={cn(
                                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                active &&
                                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                            )}>
                            <Icon size={16} strokeWidth={2} />
                            {n.label}
                        </Link>
                    );
                })}
            </nav>
            <div className='mt-auto flex items-center gap-2.5 border-t border-border p-2.5 pt-3.5'>
                <span className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-positive-soft text-[12px] font-bold text-positive'>
                    MK
                </span>
                <div>
                    <div className='text-[12.5px] font-semibold'>Marta K.</div>
                    <div className='text-[11px] text-muted-foreground'>
                        Personal account
                    </div>
                </div>
            </div>
        </aside>
    );
}
