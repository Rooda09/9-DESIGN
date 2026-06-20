import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionSchema = z.object({
  groupId: z.string(),
  value: z.string().min(1),
  labelEn: z.string().min(1),
  labelAr: z.string().min(1),
  bestFor: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  metadata: z.record(z.any()).optional()
});

export async function GET() {
  // TODO Codex: require admin, fetch from Prisma with group/domain filters.
  return NextResponse.json({ items: [], message: 'Admin dropdown options scaffold.' });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = optionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid option', details: parsed.error.flatten() }, { status: 400 });
  }

  // TODO Codex: require admin and create option in DB.
  return NextResponse.json({ item: parsed.data, message: 'Create dropdown option scaffold.' }, { status: 201 });
}
