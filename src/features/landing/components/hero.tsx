import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
    Container,
    Eyebrow,
    GridMark,
} from '@/features/landing/components/container';
import { HeroPreview } from '@/features/landing/components/hero-preview';
import { cn } from '@/lib/utils';

export function Hero() {
    return (
        <section aria-labelledby='hero-title' className='border-b border-border'>
            <Container className='pt-12 pb-16 md:pt-20 md:pb-24'>
                <Eyebrow className='mb-6 md:mb-8'>
                    Investment tracker
                    <span className='mx-2 text-border-strong'>/</span>
                    Stocks · ETFs · Crypto · Cash
                </Eyebrow>

                <h1
                    id='hero-title'
                    className='text-[clamp(40px,11vw,120px)] font-semibold uppercase leading-[0.9] tracking-[-0.045em]'>
                    Track your
                    <br />
                    investments.
                </h1>

                <div className='relative mt-12 grid gap-10 border-t border-border-strong pt-10 md:mt-16 md:pt-12 lg:grid-cols-12 lg:gap-8'>
                    <GridMark className='-top-2 -left-1.5' />
                    <GridMark className='-top-2 -right-1.5' />

                    <div className='flex flex-col justify-between gap-10 lg:col-span-5'>
                        <div>
                            <p className='mb-6 text-2xl font-medium leading-snug tracking-[-0.02em] md:text-[28px]'>
                                Stocks. ETFs. Crypto.
                                <br />
                                One place.
                            </p>
                            <p className='max-w-md text-[15px] leading-relaxed text-muted-foreground'>
                                Nordwell puts portfolio value, performance and
                                history first — and removes everything that
                                doesn&apos;t help you think long term.
                            </p>
                        </div>

                        <div className='flex flex-wrap items-center gap-3'>
                            <Link
                                href='/signup'
                                className={cn(
                                    buttonVariants(),
                                    'h-11 gap-2 px-5 text-[14px]',
                                )}>
                                Create account
                                <ArrowRight size={15} aria-hidden />
                            </Link>
                            <Link
                                href='/login'
                                className={cn(
                                    buttonVariants({ variant: 'outline' }),
                                    'h-11 px-5 text-[14px]',
                                )}>
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className='lg:col-span-7'>
                        <HeroPreview />
                    </div>
                </div>
            </Container>
        </section>
    );
}
