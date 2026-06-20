import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compilePrompt } from '@/lib/prompt-compiler';
import { evaluatePromptPackage } from '@/lib/quality-gate';

const schema = z.object({
  domain: z.enum(['ARCHITECTURE', 'PHOTOGRAPHY', 'BRANDING']),
  workflowType: z.string().min(1),
  engineKey: z.string().min(1),
  userBrief: z.string().optional(),
  selections: z.array(z.object({
    groupKey: z.string(),
    value: z.string(),
    label: z.string().optional(),
    promptFragment: z.string().optional()
  })).default([]),
  references: z.array(z.object({
    id: z.string(),
    url: z.string(),
    role: z.enum(['GEOMETRY_REFERENCE', 'STYLE_REFERENCE', 'MATERIAL_REFERENCE', 'LIGHTING_REFERENCE', 'CAMERA_REFERENCE', 'BRAND_REFERENCE', 'PRODUCT_REFERENCE', 'MOTION_REFERENCE']),
    lockStrength: z.enum(['LOW', 'MEDIUM', 'HIGH', 'STRICT']).optional()
  })).optional(),
  negativeConstraints: z.array(z.string()).optional(),
  storytelling: z.any().optional(),
  audio: z.any().optional(),
  upscale: z.any().optional()
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const promptPackage = compilePrompt(parsed.data);
  const qualityGate = evaluatePromptPackage(parsed.data.domain, promptPackage);

  return NextResponse.json({ promptPackage, qualityGate });
}
