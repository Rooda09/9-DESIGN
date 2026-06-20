import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { attachSession, isFormRequest, readRequestInput, redirectTo } from '@/lib/auth/request';
import { normalizeEmail, verifyPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const input = await readRequestInput(req);
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    if (isFormRequest(req)) return redirectTo(req, '/login?error=invalid');
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(parsed.data.email) },
    include: { profile: true, wallet: true }
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    if (isFormRequest(req)) return redirectTo(req, '/login?error=credentials');
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const response = isFormRequest(req)
    ? redirectTo(req, user.role === 'ADMIN' ? '/admin' : '/profile')
    : NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } });
  return attachSession(response, user);
}
