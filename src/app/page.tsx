export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Architecture Studio MVP</h1>
      <p>
        Architecture-first prompt compiler for controlled visualization, Geometry Guard decisions, reference role handling,
        and private prompt-library saves.
      </p>
      <p>
        The current MVP intentionally prioritizes Architecture Studio. Photography, Branding, Community, Competitions,
        Payments, Marketplace, and real AI generation APIs remain out of scope.
      </p>
      <p>
        <a href="/register">Create account</a> {' | '}
        <a href="/login">Log in</a> {' | '}
        <a href="/create/architecture">Open Architecture studio</a>
      </p>
      <section>
        <h2>MVP scope</h2>
        <ul>
          <li>Architecture - active MVP route for templates, dropdowns, Geometry Guard, references, and prompt packages.</li>
          <li>Photography - Coming Soon placeholder only.</li>
          <li>Branding - Coming Soon placeholder only.</li>
        </ul>
      </section>
    </main>
  );
}
