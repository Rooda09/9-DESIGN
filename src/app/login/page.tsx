type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasError = Boolean(params?.error);

  return (
    <main style={{ padding: 32, maxWidth: 560 }}>
      <h1>Log in</h1>
      <p>Use your account email and password to access your profile, token wallet, and protected studio areas.</p>
      {hasError ? <p style={{ color: '#b91c1c' }}>Login failed. Check your email and password.</p> : null}
      {params?.loggedOut ? <p style={{ color: '#047857' }}>You have been logged out.</p> : null}
      <form action="/api/auth/login" method="post" style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" style={{ display: 'block', width: '100%' }} />
        </label>
        <button type="submit">Log in</button>
      </form>
      <p>
        <a href="/forgot-password">Forgot password?</a> {' | '}
        <a href="/register">Create an account</a>
      </p>
    </main>
  );
}
