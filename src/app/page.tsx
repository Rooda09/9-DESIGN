export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Creative Control Platform</h1>
      <p>Professional AI image, clip, audio, upscale, prompt, scenario, community, and competition platform.</p>
      <p>
        Phase 1 adds authentication, profile, and token wallet foundations. AI integrations and community features remain out of scope.
      </p>
      <p>
        <a href="/register">Create account</a> {' | '}
        <a href="/login">Log in</a> {' | '}
        <a href="/tokens">View token wallet</a>
      </p>
      <section>
        <h2>Main Domains</h2>
        <ul>
          <li>Architecture - Geometry Guard and controlled visualization</li>
          <li>Photography - Product lock and commercial image systems</li>
          <li>Branding - Brand memory and campaign production</li>
        </ul>
      </section>
    </main>
  );
}
