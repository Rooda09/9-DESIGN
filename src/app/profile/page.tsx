import { requireCurrentUser } from '@/lib/auth/request';

export default async function ProfilePage() {
  const user = await requireCurrentUser();

  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <h1>Profile</h1>
      <p>Signed in as {user.email}. Role: {user.role}.</p>
      <form action="/api/profile" method="post" style={{ display: 'grid', gap: 12 }}>
        <label>
          Display name
          <input name="displayName" defaultValue={user.profile?.displayName ?? ''} maxLength={80} style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Bio
          <textarea name="bio" defaultValue={user.profile?.bio ?? ''} maxLength={500} rows={4} style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Avatar URL
          <input name="avatarUrl" defaultValue={user.profile?.avatarUrl ?? ''} type="url" style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Locale
          <input name="locale" defaultValue={user.profile?.locale ?? 'en'} maxLength={12} style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Timezone
          <input name="timezone" defaultValue={user.profile?.timezone ?? ''} maxLength={80} style={{ display: 'block', width: '100%' }} />
        </label>
        <button type="submit">Save profile</button>
      </form>
      <form action="/api/auth/logout" method="post" style={{ marginTop: 24 }}>
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
