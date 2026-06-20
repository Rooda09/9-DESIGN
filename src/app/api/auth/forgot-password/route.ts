import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPasswordResetToken, normalizeEmail } from '@/lib/auth/password';
import { isFormRequest, readRequestInput, redirectTo } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export async function POST(req: NextRequest) {
  const input = await readRequestInput(req);
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    if (isFormRequest(req)) return redirectTo(req, '/forgot-password?error=invalid');
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  const user = await prisma.user.findUnique({ where: { email } });
  let developmentToken: string | undefined;

  if (user) {
    const reset = createPasswordResetToken();
    developmentToken = reset.token;
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        email,
        tokenHash: reset.tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });
  }

  const body = {
    message: 'If an account exists for that email, a password reset link will be sent.',
    ...(process.env.AUTH_EXPOSE_RESET_TOKEN === 'true' && developmentToken ? { developmentToken } : {})
  };

  if (isFormRequest(req)) return redirectTo(req, '/forgot-password?sent=1');
  return NextResponse.json(body);
}
