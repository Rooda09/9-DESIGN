import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { attachSession, isFormRequest, readRequestInput, redirectTo } from '@/lib/auth/request';
import { hashPassword, normalizeEmail, normalizeUsername, validatePasswordPolicy } from '@/lib/auth/password';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().max(80).optional(),
  password: z.string()
}).superRefine((value, ctx) => {
  for (const error of validatePasswordPolicy(value.password)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: error });
  }
});

export async function POST(req: NextRequest) {
  const input = await readRequestInput(req);
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    if (isFormRequest(req)) return redirectTo(req, '/register?error=invalid');
    return NextResponse.json({ error: 'Invalid registration data.', details: parsed.error.flatten() }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  const username = normalizeUsername(parsed.data.username);
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        profile: {
          create: {
            displayName: parsed.data.displayName?.trim() || username
          }
        },
        wallet: {
          create: {}
        }
      },
      include: { profile: true, wallet: true }
    });

    const response = isFormRequest(req)
      ? redirectTo(req, '/profile')
      : NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } }, { status: 201 });
    return attachSession(response, user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      if (isFormRequest(req)) return redirectTo(req, '/register?error=exists');
      return NextResponse.json({ error: 'Email or username is already registered.' }, { status: 409 });
    }
    throw error;
  }
}
