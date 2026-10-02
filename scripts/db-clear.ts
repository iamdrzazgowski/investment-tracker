import { prisma } from '@/lib/prisma';

const FORCE_FLAG = '--force';

async function clearDatabase() {
    if (
        process.env.NODE_ENV === 'production' &&
        !process.argv.includes(FORCE_FLAG)
    ) {
        console.error(
            `Refusing to clear the database in production without ${FORCE_FLAG}.`,
        );
        process.exit(1);
    }

    // Children before parents: Holding/Transaction reference Asset with
    // onDelete Restrict, so they must go before Asset.
    const counts = await prisma.$transaction(async (tx) => {
        const watchlistItems = await tx.watchlistItem.deleteMany();
        const transactions = await tx.transaction.deleteMany();
        const holdings = await tx.holding.deleteMany();
        const portfolioSnapshots = await tx.portfolioSnapshot.deleteMany();
        const priceSnapshots = await tx.priceSnapshot.deleteMany();
        const portfolios = await tx.portfolio.deleteMany();
        const assets = await tx.asset.deleteMany();
        const sessions = await tx.session.deleteMany();
        const accounts = await tx.account.deleteMany();
        const verifications = await tx.verification.deleteMany();
        const users = await tx.user.deleteMany();

        return {
            watchlistItems: watchlistItems.count,
            transactions: transactions.count,
            holdings: holdings.count,
            portfolioSnapshots: portfolioSnapshots.count,
            priceSnapshots: priceSnapshots.count,
            portfolios: portfolios.count,
            assets: assets.count,
            sessions: sessions.count,
            accounts: accounts.count,
            verifications: verifications.count,
            users: users.count,
        };
    });

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    console.log('Database cleared.');
    for (const [table, count] of Object.entries(counts)) {
        console.log(`  ${table}: ${count}`);
    }
    console.log(`  total rows deleted: ${total}`);
}

try {
    await clearDatabase();
} catch (error) {
    console.error('Failed to clear database:', error);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}
