import Link from 'next/link';
import { NordwellLogo } from '@/components/shared/nordwell-logo';
import AuthShowcase from '@/features/auth/components/auth-showcase';

/**
 * Shared layout for the login and signup pages: form column on the left,
 * brand showcase on the right (desktop only). On smaller screens the showcase
 * is hidden, so the logo is repeated at the top of the form column.
 */
export function AuthShell({
    children,
    widthClass = 'max-w-sm',
}: {
    children: React.ReactNode;
    /** Max-width of the form column, e.g. `max-w-md` for longer forms. */
    widthClass?: string;
}) {
    return (
        <div className='min-h-svh bg-background text-foreground'>
            <div className='grid min-h-svh lg:grid-cols-2'>
                <div className='flex flex-col px-6 py-6 md:px-10 md:py-8'>
                    <Link
                        href='/'
                        aria-label='Nordwell'
                        className='w-fit lg:hidden'>
                        <NordwellLogo />
                    </Link>

                    <div className='flex flex-1 items-center justify-center py-6'>
                        <div className={`w-full ${widthClass}`}>
                            {children}
                        </div>
                    </div>
                </div>

                <AuthShowcase />
            </div>
        </div>
    );
}
