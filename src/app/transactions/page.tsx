import { AppShell } from '@/components/shared/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getTransactionsForPortfolio } from '@/lib/repositories/transaction.repository';
import {
    TransactionsTable,
    type TransactionRow,
} from '@/features/transactions/components/transactions-table';

export default async function TransactionsPage() {
    const portfolio = await requirePortfolio();
    const txs = await getTransactionsForPortfolio(portfolio.id);

    const rows: TransactionRow[] = txs.map((tx) => {
        const qty = tx.quantity.toNumber();
        const price = tx.price.toNumber();
        return {
            id: tx.id,
            date: tx.executedAt.toISOString(),
            ticker: tx.asset.ticker,
            name: tx.asset.name,
            cat:
                tx.asset.category === 'ETF'
                    ? 'ETFs'
                    : tx.asset.category === 'CRYPTO'
                      ? 'Crypto'
                      : 'Stocks',
            type: tx.type === 'BUY' ? 'buy' : 'sell',
            qty,
            price,
            currency: tx.asset.currency,
        };
    });

    return (
        <AppShell>
            <PageHeader eyebrow='History' title='Transactions' />
            <TransactionsTable rows={rows} />
        </AppShell>
    );
}
