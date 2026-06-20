type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main style={{ padding: 32, maxWidth: 560 }}>
      <h1>Forgot password</h1>
      <p>This Phase 1 flow creates a reset token record. Email delivery and reset completion are intentionally left for a later provider integration.</p>
      {params?.sent ? <p style={{ color: '#047857' }}>If an account exists, a reset link will be sent.</p> : null}
      {params?.error ? <p style={{ color: '#b91c1c' }}>Enter a valid email address.</p> : null}
      <form action="/api/auth/forgot-password" method="post" style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" style={{ display: 'block', width: '100%' }} />
        </label>
        <button type="submit">Request reset</button>
      </form>
      <p><a href="/login">Back to login</a></p>
    </main>
  );
}
