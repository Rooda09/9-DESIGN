import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { TokenWallet, User, UserProfile } from '@prisma/client';
import { prisma } from '@/lib/db';
import {
  createSessionToken,
  expiredSessionCookieOptions,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  verifySessionToken
} from './session';

export type CurrentUser = User & {
  profile: UserProfile | null;
  wallet: TokenWallet | null;
};

export function isFormRequest(req: NextRequest): boolean {
  return (req.headers.get('content-type') ?? '').includes('form');
}

export async function readRequestInput(req: NextRequest): Promise<Record<string, string>> {
  if ((req.headers.get('content-type') ?? '').includes('application/json')) {
    const json = await req.json();
    return Object.fromEntries(Object.entries(json).map(([key, value]) => [key, String(value ?? '')]));
  }

  const form = await req.formData();
  return Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value)]));
}

export function redirectTo(req: NextRequest, path: string, status = 303): NextResponse {
  return NextResponse.redirect(new URL(path, req.url), { status });
}

export function clearSession(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, '', expiredSessionCookieOptions());
  return response;
}

export function attachSession(response: NextResponse, user: { id: string; email: string; role: CurrentUser['role'] }): NextResponse {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  response.cookies.set(
    SESSION_COOKIE_NAME,
    createSessionToken({ userId: user.id, email: user.email, role: user.role }),
    sessionCookieOptions(expiresAt)
  );
  return response;
}

export async function getUserFromSessionToken(token: string | undefined): Promise<CurrentUser | null> {
  const session = verifySessionToken(token);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true, wallet: true }
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  return getUserFromSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getRequestUser(req: NextRequest): Promise<CurrentUser | null> {
  return getUserFromSessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdminUser(): Promise<CurrentUser> {
  const user = await requireCurrentUser();
  if (user.role !== 'ADMIN') redirect('/profile');
  return user;
}

export async function requireApiUser(req: NextRequest): Promise<{ user: CurrentUser } | { response: NextResponse }> {
  const user = await getRequestUser(req);
  if (!user) {
    return { response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  }
  return { user };
}

export async function requireApiAdmin(req: NextRequest): Promise<{ user: CurrentUser } | { response: NextResponse }> {
  const result = await requireApiUser(req);
  if ('response' in result) return result;
  if (result.user.role !== 'ADMIN') {
    return { response: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }
  return result;
}
