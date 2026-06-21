import { NextRequest, NextResponse } from 'next/server';
import { compileArchitectureUpscalePrompt } from '@/lib/architecture/upscale/compiler';
import { architectureUpscaleCompileSchema } from '@/lib/architecture/upscale/validation';

export async function POST(req: NextRequest) {
  const parsed = architectureUpscaleCompileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid Architecture upscale request.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const upscalePackage = compileArchitectureUpscalePrompt(parsed.data);
  return NextResponse.json({ upscalePackage });
}
