import 'server-only';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function requirePortfolio() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');

    return prisma.portfolio.findUniqueOrThrow({
        where: { userId: session.user.id },
    });
}
