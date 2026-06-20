import { prisma } from '@/lib/db';

export async function ensureTokenWallet(userId: string) {
  return prisma.tokenWallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });
}
