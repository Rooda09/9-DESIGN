const domainCardStyle = {
  display: 'grid',
  gap: 10,
  minHeight: 180,
  padding: 22,
  border: '1px solid #30383b',
  borderRadius: 8,
  background: '#14191b',
  color: '#edf2ee',
  textDecoration: 'none'
};

export default function CreatePage() {
  return (
    <main style={{ minHeight: 'calc(100vh - 58px)', padding: '48px 32px', background: '#0b0e0f', color: '#edf2ee' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <p style={{ color: '#91a99c', textTransform: 'uppercase', fontSize: 12, fontWeight: 700 }}>Create studio</p>
        <h1 style={{ maxWidth: 720, fontSize: 42, lineHeight: 1.05, margin: '10px 0 14px' }}>Choose a professional creative domain</h1>
        <p style={{ maxWidth: 680, color: '#aeb9b3', lineHeight: 1.7 }}>
          Phase 3 activates the Architecture prompt compiler and Geometry Guard. Other domains remain intentionally unavailable.
        </p>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 32 }}>
          <a href="/create/architecture" style={{ ...domainCardStyle, borderColor: '#7fa08d' }}>
            <span style={{ color: '#9fc1ad', fontSize: 13, fontWeight: 700 }}>AVAILABLE</span>
            <strong style={{ fontSize: 24 }}>Architecture</strong>
            <span style={{ color: '#b8c3bd', lineHeight: 1.55 }}>Database templates, intelligent dropdowns, reference roles, and Geometry Guard.</span>
          </a>
          <div aria-disabled="true" style={{ ...domainCardStyle, opacity: 0.5 }}>
            <span style={{ color: '#8b9691', fontSize: 13, fontWeight: 700 }}>LATER PHASE</span>
            <strong style={{ fontSize: 24 }}>Photography</strong>
            <span style={{ color: '#a4ada8' }}>Product lock and commercial photography controls are not implemented in Phase 3.</span>
          </div>
          <div aria-disabled="true" style={{ ...domainCardStyle, opacity: 0.5 }}>
            <span style={{ color: '#8b9691', fontSize: 13, fontWeight: 700 }}>LATER PHASE</span>
            <strong style={{ fontSize: 24 }}>Branding</strong>
            <span style={{ color: '#a4ada8' }}>Brand memory and campaign workflows are not implemented in Phase 3.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
