import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  domain: z.enum(['ARCHITECTURE', 'PHOTOGRAPHY', 'BRANDING']),
  jobType: z.enum(['IMAGE_GENERATION', 'CLIP_GENERATION', 'AUDIO_GENERATION', 'IMAGE_UPSCALE', 'CLIP_UPSCALE']),
  engineKey: z.string().min(1),
  promptPackage: z.record(z.string(), z.any()),
  projectId: z.string().optional()
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  // TODO Codex: implement auth, token pre-check, DB insert, queue enqueue, and provider adapter call.
  return NextResponse.json({
    status: 'QUEUED_PLACEHOLDER',
    message: 'Generation job route scaffold created. Implement auth, token debit, DB insert, and queue processing.',
    input: parsed.data
  }, { status: 202 });
}
