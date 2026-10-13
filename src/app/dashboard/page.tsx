import { AppShell } from '@/components/shared/app-shell';
import { AddFundsDialog } from '@/features/portfolio/components/add-funds-dialog';
import { AllocationDonut } from '@/features/portfolio/components/allocation-donut';
import { Delta } from '@/components/shared/delta';
import { HoldingsPreview } from '@/features/portfolio/components/holdings-preview';
import { PerformanceChart } from '@/features/portfolio/components/performance-chart';
import { RecentTransactions } from '@/features/portfolio/components/recent-transactions';
import { StatRow } from '@/features/portfolio/components/stat-row';
import { TopMovers } from '@/features/portfolio/components/top-movers';
import { fmtEUR, fmtSigned } from '@/lib/format';

export default function DashboardPage() {
    return (
        <AppShell>
            <section
                aria-labelledby='portfolio-value-label'
                className='mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 md:mb-10'>
                <div>
                    <h1
                        id='portfolio-value-label'
                        className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        Portfolio value
                    </h1>
                    <div className='text-[44px] font-medium leading-none tracking-[-0.04em] tabular-nums md:text-[64px]'>
                        {fmtEUR(3000)}
                    </div>
                    <div className='mt-4 flex items-center gap-3'>
                        <Delta value={10} />
                        <span className='font-mono text-[13px] text-muted-foreground'>
                            {fmtSigned(10)} today
                        </span>
                    </div>
                </div>
                <AddFundsDialog />
            </section>

            <div className='space-y-6 md:space-y-8'>
                <PerformanceChart seed={1} endValue={5000} showValue={false} />

                <StatRow totals={0} />

                <div className='grid gap-6 md:gap-8 lg:grid-cols-[1.55fr_1fr]'>
                    <HoldingsPreview />
                    <AllocationDonut />
                </div>

                <div className='grid gap-6 md:gap-8 lg:grid-cols-[1.55fr_1fr]'>
                    <RecentTransactions />
                    <TopMovers />
                </div>
            </div>
        </AppShell>
    );
}
