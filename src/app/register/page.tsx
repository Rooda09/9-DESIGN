type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main style={{ padding: 32, maxWidth: 560 }}>
      <h1>Create account</h1>
      <p>New accounts start as USER. ADMIN access must be assigned directly in the database by an operator.</p>
      {params?.error ? <p style={{ color: '#b91c1c' }}>Registration failed. Use a unique email and username, and a stronger password.</p> : null}
      <form action="/api/auth/register" method="post" style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Username
          <input name="username" required minLength={3} maxLength={32} autoComplete="username" style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Display name
          <input name="displayName" maxLength={80} style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={10} autoComplete="new-password" style={{ display: 'block', width: '100%' }} />
        </label>
        <button type="submit">Create account</button>
      </form>
      <p><a href="/login">Already have an account?</a></p>
    </main>
  );
}
