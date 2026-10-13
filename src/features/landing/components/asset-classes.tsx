import {
    Container,
    Eyebrow,
    GridMark,
} from '@/features/landing/components/container';

const CLASSES = [
    {
        n: '01',
        label: 'Stocks',
        text: 'Positions, average cost and unrealised profit or loss for every company you own.',
    },
    {
        n: '02',
        label: 'ETFs',
        text: 'Broad-market funds sit next to single names, measured the same way.',
    },
    {
        n: '03',
        label: 'Crypto',
        text: 'Digital assets live in the same ledger instead of a separate app.',
    },
    {
        n: '04',
        label: 'Cash',
        text: 'Your balance is part of the picture, not an afterthought.',
    },
];

export function AssetClasses() {
    return (
        <section
            id='classes'
            aria-labelledby='classes-title'
            className='scroll-mt-4 border-b border-border'>
            <Container className='py-16 md:py-24'>
                <div className='mb-10 grid gap-4 md:mb-14 lg:grid-cols-12 lg:gap-8'>
                    <Eyebrow className='lg:col-span-5'>Asset classes</Eyebrow>
                    <h2
                        id='classes-title'
                        className='text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[44px] lg:col-span-7'>
                        Everything you own,
                        <br />
                        in one view.
                    </h2>
                </div>

                <ul className='relative grid border-t border-l border-border-strong sm:grid-cols-2 lg:grid-cols-4'>
                    <GridMark className='-top-2 -left-1.5' />
                    <GridMark className='-top-2 -right-1.5' />
                    <GridMark className='-bottom-2 -left-1.5' />
                    <GridMark className='-right-1.5 -bottom-2' />

                    {CLASSES.map((c) => (
                        <li
                            key={c.label}
                            className='flex min-h-64 flex-col justify-between border-r border-b border-border-strong p-6 md:min-h-72'>
                            <span className='font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground'>
                                {c.n}
                            </span>
                            <div>
                                <h3 className='mb-3 text-[32px] font-semibold uppercase leading-none tracking-[-0.04em] md:text-[40px]'>
                                    {c.label}
                                </h3>
                                <p className='text-[14px] leading-relaxed text-muted-foreground'>
                                    {c.text}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
