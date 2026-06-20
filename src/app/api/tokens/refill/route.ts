import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isFormRequest, readRequestInput, redirectTo, requireApiUser } from '@/lib/auth/request';
import { findTokenRefillOption } from '@/lib/tokens/refill-options';
import { ensureTokenWallet } from '@/lib/tokens/wallet';
import { prisma } from '@/lib/db';

const refillSchema = z.object({
  packageKey: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const input = await readRequestInput(req);
  const parsed = refillSchema.safeParse(input);
  const option = parsed.success ? findTokenRefillOption(parsed.data.packageKey) : undefined;

  if (!parsed.success || !option) {
    if (isFormRequest(req)) return redirectTo(req, '/tokens?error=invalid-package');
    return NextResponse.json({ error: 'Invalid token refill package.' }, { status: 400 });
  }

  const wallet = await ensureTokenWallet(auth.user.id);
  const transaction = await prisma.tokenTransaction.create({
    data: {
      userId: auth.user.id,
      walletId: wallet.id,
      type: 'REFILL',
      status: 'PENDING',
      amount: option.tokens,
      balanceAfter: wallet.balance,
      providerRef: `payment_placeholder_${randomUUID()}`,
      description: `${option.label} requested. Payment integration is not implemented in Phase 1.`,
      metadata: {
        packageKey: option.key,
        estimatedPriceUsd: option.estimatedPriceUsd
      }
    }
  });

  if (isFormRequest(req)) return redirectTo(req, '/tokens?refill=pending');
  return NextResponse.json({ transaction, message: 'Token refill request recorded as pending. Payment is not integrated yet.' }, { status: 202 });
}
