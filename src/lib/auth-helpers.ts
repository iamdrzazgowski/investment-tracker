import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * React.cache() deduplicates the session + portfolio lookup within a single
 * request, so multiple call sites (page, layout, parallel server code) share
 * one auth round-trip and one Prisma query instead of repeating them.
 */
export const requirePortfolio = cache(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');

    return prisma.portfolio.findUniqueOrThrow({
        where: { userId: session.user.id },
    });
});
