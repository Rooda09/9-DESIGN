import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/request';
import { createAdminRecord, getAdminResource, listAdminRecords, validateAdminRecordInput } from '@/lib/admin/resources';

const dropdownOptionsResource = getAdminResource('dropdown-options');

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin(req);
  if ('response' in auth) return auth.response;
  if (!dropdownOptionsResource) return NextResponse.json({ error: 'Dropdown options resource missing.' }, { status: 500 });

  const items = await listAdminRecords(dropdownOptionsResource);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAdmin(req);
  if ('response' in auth) return auth.response;
  if (!dropdownOptionsResource) return NextResponse.json({ error: 'Dropdown options resource missing.' }, { status: 500 });

  const json = await req.json();
  const parsed = validateAdminRecordInput(dropdownOptionsResource, json);
  if (!parsed.ok) {
    return NextResponse.json({ error: 'Invalid option', details: parsed.errors }, { status: 400 });
  }

  const item = await createAdminRecord(dropdownOptionsResource, parsed.data);
  return NextResponse.json({ item }, { status: 201 });
}
