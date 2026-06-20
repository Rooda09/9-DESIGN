import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/auth/request';
import { AdminRecordForm, AdminRecordTable } from '@/lib/admin/ui';
import { getAdminResource, getRelationOptions, listAdminRecords } from '@/lib/admin/resources';

type PageProps = {
  params: Promise<{ resource: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminResourcePage({ params, searchParams }: PageProps) {
  await requireAdminUser();
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);
  if (!resource) notFound();

  const [records, relationOptions, query] = await Promise.all([
    listAdminRecords(resource),
    getRelationOptions(resource),
    searchParams
  ]);

  return (
    <main style={{ padding: 32, maxWidth: 1200 }}>
      <p><a href="/admin">Back to admin dashboard</a></p>
      <h1>{resource.title}</h1>
      <p>{resource.description}</p>
      {query?.created ? <p style={{ color: '#047857' }}>Record created.</p> : null}
      {query?.updated ? <p style={{ color: '#047857' }}>Record updated.</p> : null}
      {query?.deleted ? <p style={{ color: '#047857' }}>Record deleted.</p> : null}
      {query?.error ? <p style={{ color: '#b91c1c' }}>Action failed. Check required fields and JSON values.</p> : null}

      <section style={{ marginTop: 24 }}>
        <h2>Create {resource.title.toLowerCase()} record</h2>
        <AdminRecordForm
          resource={resource}
          action={`/api/admin-crud/${resource.slug}`}
          submitLabel="Create record"
          fieldOptions={relationOptions}
        />
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Records</h2>
        <AdminRecordTable resource={resource} records={records} />
      </section>
    </main>
  );
}
