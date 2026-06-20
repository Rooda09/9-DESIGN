import { requireAdminUser } from '@/lib/auth/request';
import { ADMIN_NAV_ITEMS } from '@/lib/admin/resources';

export default async function AdminPage() {
  const admin = await requireAdminUser();

  return (
    <main style={{ padding: 32, maxWidth: 1100 }}>
      <h1>Admin database management</h1>
      <p>Signed in as {admin.email}. This route is protected and only ADMIN users can access it.</p>
      <p>Phase 2 manages database records for creative domains, dropdowns, templates, prompt library, clip scenarios, AI engines, upscale settings, and audio background settings.</p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 24 }}>
        {ADMIN_NAV_ITEMS.map(item => (
          <a key={item.slug} href={`/admin/${item.slug}`} style={{ display: 'block', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff', textDecoration: 'none', color: 'inherit' }}>
            <strong>{item.title}</strong>
            <span style={{ display: 'block', color: '#6b7280', marginTop: 6 }}>{item.description}</span>
          </a>
        ))}
      </section>
    </main>
  );
}
