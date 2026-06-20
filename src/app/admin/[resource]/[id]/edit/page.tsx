import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/auth/request';
import { AdminRecordForm } from '@/lib/admin/ui';
import { getAdminRecord, getAdminResource, getRelationOptions } from '@/lib/admin/resources';

type PageProps = {
  params: Promise<{ resource: string; id: string }>;
};

export default async function AdminEditRecordPage({ params }: PageProps) {
  await requireAdminUser();
  const { resource: slug, id } = await params;
  const resource = getAdminResource(slug);
  if (!resource) notFound();

  const [record, relationOptions] = await Promise.all([
    getAdminRecord(resource, id),
    getRelationOptions(resource)
  ]);
  if (!record) notFound();

  return (
    <main style={{ padding: 32, maxWidth: 900 }}>
      <p><a href={`/admin/${resource.slug}`}>Back to {resource.title}</a></p>
      <h1>Edit {resource.title.toLowerCase()} record</h1>
      <AdminRecordForm
        resource={resource}
        record={record}
        action={`/api/admin-crud/${resource.slug}/${id}`}
        actionName="update"
        submitLabel="Save changes"
        fieldOptions={relationOptions}
      />
      <form action={`/api/admin-crud/${resource.slug}/${id}`} method="post" style={{ marginTop: 16 }}>
        <input type="hidden" name="_action" value="delete" />
        <button type="submit">Delete record</button>
      </form>
    </main>
  );
}
