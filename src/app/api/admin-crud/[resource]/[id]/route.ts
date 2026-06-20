import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminRecord, formDataToObject, getAdminResource, updateAdminRecord, validateAdminRecordInput } from '@/lib/admin/resources';
import { requireApiAdmin } from '@/lib/auth/request';

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

function redirectToResource(req: NextRequest, resource: string, status: string) {
  return NextResponse.redirect(new URL(`/admin/${resource}?${status}=1`, req.url), { status: 303 });
}

export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAdmin(req);
  if ('response' in auth) return auth.response;

  const { resource: slug, id } = await context.params;
  const resource = getAdminResource(slug);
  if (!resource) {
    return NextResponse.json({ error: 'Unknown admin resource.' }, { status: 404 });
  }

  const input = formDataToObject(await req.formData());
  if (input._action === 'delete') {
    await deleteAdminRecord(resource, id);
    return redirectToResource(req, resource.slug, 'deleted');
  }

  const parsed = validateAdminRecordInput(resource, input);
  if (!parsed.ok) {
    return redirectToResource(req, resource.slug, 'error');
  }

  await updateAdminRecord(resource, id, parsed.data);
  return redirectToResource(req, resource.slug, 'updated');
}
