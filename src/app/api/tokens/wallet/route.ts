import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/request';
import { ensureTokenWallet } from '@/lib/tokens/wallet';

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const wallet = await ensureTokenWallet(auth.user.id);
  return NextResponse.json({ wallet });
}
