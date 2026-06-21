import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/request';
import { saveArchitectureScenarioSchema } from '@/lib/architecture/clips/validation';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const parsed = saveArchitectureScenarioSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid scenario library record.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let sourceScenarioId: string | undefined;
  if (parsed.data.sourceScenarioId && !parsed.data.sourceScenarioId.startsWith('seed:')) {
    const source = await prisma.clipScenario.findFirst({
      where: {
        id: parsed.data.sourceScenarioId,
        isPublished: true,
        domain: { key: 'ARCHITECTURE' }
      },
      select: { id: true }
    });
    if (!source) {
      return NextResponse.json({ error: 'Architecture clip scenario is unavailable.' }, { status: 404 });
    }
    sourceScenarioId = source.id;
  }

  const record = await prisma.userScenario.create({
    data: {
      userId: auth.user.id,
      title: parsed.data.title,
      domainKey: 'ARCHITECTURE',
      scenarioBody: parsed.data.scenarioPackage.storytellingPrompt,
      compiledPackage: parsed.data.scenarioPackage as Prisma.InputJsonValue,
      sourceScenarioId,
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
