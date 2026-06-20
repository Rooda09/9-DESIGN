import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth/request';

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.profile,
      wallet: user.wallet
    }
  });
}
