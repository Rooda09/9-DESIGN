import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { saveArchitectureAudioSchema } from '@/lib/architecture/audio/validation';
import { requireApiUser } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const parsed = saveArchitectureAudioSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid audio library record.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const record = await prisma.userScenario.create({
    data: {
      userId: auth.user.id,
      title: parsed.data.title,
      domainKey: 'ARCHITECTURE',
      scenarioBody: parsed.data.audioPackage.backgroundAudioPrompt,
      audioPrompt: parsed.data.audioPackage.backgroundAudioPrompt,
      compiledPackage: parsed.data.audioPackage as Prisma.InputJsonValue,
      visibility: 'PRIVATE'
    },
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  });

  return NextResponse.json({ scenario: record }, { status: 201 });
}
