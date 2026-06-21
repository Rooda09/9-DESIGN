import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { saveArchitectureUpscaleSchema } from '@/lib/architecture/upscale/validation';
import { requireApiUser } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if ('response' in auth) return auth.response;

  const parsed = saveArchitectureUpscaleSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid upscale library record.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const record = await prisma.userPrompt.create({
    data: {
      userId: auth.user.id,
      title: parsed.data.title,
      domainKey: 'ARCHITECTURE',
      promptBody: parsed.data.upscalePackage.enhancementInstructions.join(' '),
      negativePrompt: parsed.data.upscalePackage.negativeUpscalePrompt,
      compiledPackage: parsed.data.upscalePackage as Prisma.InputJsonValue,
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
