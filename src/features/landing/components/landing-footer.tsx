import Link from 'next/link';
import { NordwellLogo } from '@/components/shared/nordwell-logo';
import { Container } from '@/features/landing/components/container';

export function LandingFooter() {
    return (
        <footer className='border-t border-border'>
            <Container className='flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-6'>
                    <NordwellLogo />
                    <p className='text-[12.5px] text-muted-foreground'>
                        A minimal, premium portfolio tracker.
                    </p>
                </div>

                <nav aria-label='Footer'>
                    <ul className='flex items-center gap-6 text-[13px] font-medium text-muted-foreground'>
                        <li>
                            <Link
                                href='/login'
                                className='transition-colors duration-150 hover:text-foreground'>
                                Log in
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/signup'
                                className='transition-colors duration-150 hover:text-foreground'>
                                Sign up
                            </Link>
                        </li>
                    </ul>
                </nav>
            </Container>
        </footer>
    );
}
