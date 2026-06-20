import { createHmac, timingSafeEqual } from 'node:crypto';
import type { UserRole } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'creative_control_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret || secret === 'replace_me' || secret === 'replace-with-a-secure-random-secret') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('A strong AUTH_SECRET or NEXTAUTH_SECRET is required in production.');
    }
    return 'development-only-session-secret-change-me';
  }

  return secret;
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createSessionToken(input: Omit<SessionPayload, 'exp'>, now = Date.now()): string {
  const payload: SessionPayload = {
    ...input,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): SessionPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.userId || !payload.email || !payload.role || payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  };
}

export function expiredSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0)
  };
}
