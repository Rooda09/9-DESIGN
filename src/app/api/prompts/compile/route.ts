import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { architectureCompileSchema } from '@/lib/architecture/validation';
import { prisma } from '@/lib/db';
import { compilePrompt } from '@/lib/prompt-compiler';
import { evaluatePromptPackage } from '@/lib/quality-gate';

function metadataPromptFragment(value: Prisma.JsonValue | null): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return typeof value.promptFragment === 'string' ? value.promptFragment : undefined;
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = architectureCompileSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const template = await prisma.template.findFirst({
    where: {
      id: parsed.data.templateId,
      isPublished: true,
      domain: { key: 'ARCHITECTURE' }
    },
    include: { domain: true }
  });

  if (!template) {
    return NextResponse.json({ error: 'Architecture template is unavailable.' }, { status: 404 });
  }

  const optionIds = parsed.data.selections.map(selection => selection.optionId);
  const options = optionIds.length > 0
    ? await prisma.dropdownOption.findMany({
      where: {
        id: { in: optionIds },
        isActive: true
      },
      include: { group: true }
    })
    : [];
  const optionMap = new Map(options.map(option => [option.id, option]));

  const invalidSelection = parsed.data.selections.find(selection => {
    const option = optionMap.get(selection.optionId);
    if (!option) return true;
    const belongsToArchitecture = option.group.domainId === template.domainId || option.group.domainId === null;
    return !belongsToArchitecture
      || !option.group.isActive
      || option.group.key !== selection.groupKey
      || option.value !== selection.value;
  });

  if (invalidSelection || options.length !== optionIds.length) {
    return NextResponse.json({ error: 'One or more dropdown selections are inactive or invalid.' }, { status: 400 });
  }

  const selections = parsed.data.selections.map(selection => {
    const option = optionMap.get(selection.optionId)!;
    return {
      optionId: option.id,
      groupKey: option.group.key,
      value: option.value,
      label: option.labelEn,
      promptFragment: metadataPromptFragment(option.metadata)
    };
  });

  const promptPackage = compilePrompt({
    ...parsed.data,
    templateTitle: template.titleEn,
    templateDescription: [template.descriptionEn, template.bestFor ? `Best for ${template.bestFor}` : '']
      .filter(Boolean)
      .join('. '),
    selections
  });
  const qualityGate = evaluatePromptPackage('ARCHITECTURE', promptPackage);

  return NextResponse.json({ promptPackage, qualityGate });
}
