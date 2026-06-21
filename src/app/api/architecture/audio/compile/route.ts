import { NextRequest, NextResponse } from 'next/server';
import { compileArchitectureAudioPrompt } from '@/lib/architecture/audio/compiler';
import { architectureAudioCompileSchema } from '@/lib/architecture/audio/validation';

export async function POST(req: NextRequest) {
  const parsed = architectureAudioCompileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid Architecture audio request.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const audioPackage = compileArchitectureAudioPrompt(parsed.data);
  return NextResponse.json({ audioPackage });
}
