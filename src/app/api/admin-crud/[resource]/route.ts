import { NextRequest, NextResponse } from 'next/server';
import { createAdminRecord, formDataToObject, getAdminResource, validateAdminRecordInput } from '@/lib/admin/resources';
import { requireApiAdmin } from '@/lib/auth/request';

type RouteContext = {
  params: Promise<{ resource: string }>;
};

function redirectToAdmin(req: NextRequest, resource: string, status: string) {
  return NextResponse.redirect(new URL(`/admin/${resource}?${status}=1`, req.url), { status: 303 });
}

export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAdmin(req);
  if ('response' in auth) return auth.response;

  const { resource: slug } = await context.params;
  const resource = getAdminResource(slug);
  if (!resource) {
    return NextResponse.json({ error: 'Unknown admin resource.' }, { status: 404 });
  }

  const input = formDataToObject(await req.formData());
  const parsed = validateAdminRecordInput(resource, input);
  if (!parsed.ok) {
    return redirectToAdmin(req, resource.slug, 'error');
  }

  await createAdminRecord(resource, parsed.data);
  return redirectToAdmin(req, resource.slug, 'created');
}
