import { NextRequest, NextResponse } from 'next/server';
import { clearSession, isFormRequest, redirectTo } from '@/lib/auth/request';

export async function POST(req: NextRequest) {
  const response = isFormRequest(req)
    ? redirectTo(req, '/login?loggedOut=1')
    : NextResponse.json({ message: 'Logged out.' });
  return clearSession(response);
}
