export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Creative Control Platform</h1>
      <p>Professional AI image, clip, audio, upscale, prompt, scenario, community, and competition platform.</p>
      <p>
        Phase 3 adds the Architecture Prompt Compiler MVP, Geometry Guard, engine-specific prompt packages, and save-to-library support. Real AI generation remains out of scope.
      </p>
      <p>
        <a href="/register">Create account</a> {' | '}
        <a href="/login">Log in</a> {' | '}
        <a href="/create/architecture">Open Architecture studio</a>
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
