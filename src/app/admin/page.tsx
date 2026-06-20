import { requireAdminUser } from '@/lib/auth/request';

export default async function AdminPage() {
  const admin = await requireAdminUser();

  return (
    <main style={{ padding: 32, maxWidth: 760 }}>
      <h1>Admin dashboard placeholder</h1>
      <p>Signed in as {admin.email}. This route is protected and only ADMIN users can access it.</p>
      <p>Phase 1 stops at the dashboard shell and admin guard. Full dropdown, template, engine, moderation, and database management screens are intentionally out of scope.</p>
    </main>
  );
}
