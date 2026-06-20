import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isFormRequest, readRequestInput, redirectTo, requireApiUser } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

const profileSchema = z.object({
  displayName: z.string().max(80).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().or(z.literal('')).optional(),
  locale: z.string().min(2).max(12).optional(),
  timezone: z.string().max(80).optional()
});

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;
  return NextResponse.json({ profile: auth.user.profile });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const input = await readRequestInput(req);
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    if (isFormRequest(req)) return redirectTo(req, '/profile?error=invalid');
    return NextResponse.json({ error: 'Invalid profile data.', details: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: auth.user.id },
    create: { userId: auth.user.id, ...parsed.data },
    update: parsed.data
  });

  if (isFormRequest(req)) return redirectTo(req, '/profile?updated=1');
  return NextResponse.json({ profile });
}
