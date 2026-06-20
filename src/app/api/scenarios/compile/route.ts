import { NextRequest, NextResponse } from 'next/server';
import { getArchitectureClipScenario } from '@/config/architecture-clips';
import { compileArchitectureClipScenario } from '@/lib/architecture/clips/compiler';
import { architectureClipCompileSchema } from '@/lib/architecture/clips/validation';

export async function POST(req: NextRequest) {
  const parsed = architectureClipCompileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid Architecture clip scenario request.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const scenario = getArchitectureClipScenario(parsed.data.scenarioKey);
  if (!scenario) {
    return NextResponse.json({ error: 'Architecture clip scenario is unavailable.' }, { status: 404 });
  }

  const scenarioPackage = compileArchitectureClipScenario(parsed.data);
  return NextResponse.json({ scenarioPackage });
}
