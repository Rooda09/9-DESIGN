import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { saveArchitecturePromptSchema } from '@/lib/architecture/validation';
import { requireApiUser } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const parsed = saveArchitecturePromptSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid prompt library record.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const template = await prisma.template.findFirst({
    where: {
      id: parsed.data.templateId,
      isPublished: true,
      domain: { key: 'ARCHITECTURE' }
    }
  });
  if (!template) {
    return NextResponse.json({ error: 'Architecture template is unavailable.' }, { status: 404 });
  }

  const record = await prisma.userPrompt.create({
    data: {
      userId: auth.user.id,
      title: parsed.data.title,
      domainKey: 'ARCHITECTURE',
      promptBody: parsed.data.promptPackage.mainPrompt,
      negativePrompt: parsed.data.promptPackage.negativePrompt,
      compiledPackage: parsed.data.promptPackage as Prisma.InputJsonValue,
      sourceTemplateId: template.id,
      visibility: 'PRIVATE'
    },
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  });

  return NextResponse.json({ prompt: record }, { status: 201 });
}
