import Link from 'next/link';
import { NordwellLogo } from '@/components/shared/nordwell-logo';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/features/landing/components/container';
import { cn } from '@/lib/utils';

const LINKS = [
    { href: '#classes', label: 'Asset classes' },
    { href: '#product', label: 'Product' },
];

export function LandingHeader() {
    return (
        <header className='border-b border-border'>
            <Container className='flex h-16 items-center justify-between gap-6'>
                <Link href='/' aria-label='Nordwell — home'>
                    <NordwellLogo />
                </Link>

                <nav aria-label='Main' className='flex items-center gap-1'>
                    <ul className='mr-4 hidden items-center gap-6 md:flex'>
                        {LINKS.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    className='text-[13.5px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground'>
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href='/login'
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            'h-9 px-3.5 text-[13.5px]',
                        )}>
                        Log in
                    </Link>
                    <Link
                        href='/signup'
                        className={cn(
                            buttonVariants(),
                            'h-9 px-3.5 text-[13.5px]',
                        )}>
                        Get started
                    </Link>
                </nav>
            </Container>
        </header>
    );
}
