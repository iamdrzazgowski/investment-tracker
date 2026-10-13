import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/features/landing/components/container';
import { cn } from '@/lib/utils';

export function CtaBand() {
    return (
        <section
            aria-labelledby='cta-title'
            className='bg-foreground text-background'>
            <Container className='py-16 md:py-24'>
                <h2
                    id='cta-title'
                    className='mb-12 text-[clamp(36px,9vw,104px)] font-semibold uppercase leading-[0.92] tracking-[-0.045em] md:mb-16'>
                    Quiet.
                    <br />
                    Precise.
                    <br />
                    Built for the
                    <br />
                    long term.
                </h2>

                <div className='flex flex-col gap-6 border-t border-background/20 pt-8 md:flex-row md:items-center md:justify-between'>
                    <p className='max-w-md text-[15px] leading-relaxed text-background/60'>
                        No flashing prices. No &ldquo;buy now&rdquo; prompts.
                        Just your portfolio, clearly.
                    </p>
                    <div className='flex flex-wrap items-center gap-3'>
                        <Link
                            href='/signup'
                            className={cn(
                                buttonVariants(),
                                'h-11 gap-2 bg-background px-5 text-[14px] text-foreground hover:bg-background/85',
                            )}>
                            Create account
                            <ArrowRight size={15} aria-hidden />
                        </Link>
                        <Link
                            href='/login'
                            className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'h-11 border-background/25 px-5 text-[14px] text-background hover:border-background/50 hover:bg-background/10 hover:text-background',
                            )}>
                            Log in
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
