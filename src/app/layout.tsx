export const metadata = {
  title: 'Architecture Studio MVP',
  description: 'Architecture-first prompt compiler, Geometry Guard, and clip scenario planning MVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc', color: '#111827' }}>
        <nav style={{ display: 'flex', gap: 16, padding: '16px 32px', borderBottom: '1px solid #e5e7eb', background: '#ffffff', flexWrap: 'wrap' }}>
          <a href="/create/architecture" style={{ fontWeight: 800 }}>Architecture Studio</a>
          <a href="/create/architecture/clips" style={{ fontWeight: 700 }}>Architecture Clips</a>
          <a href="/create/architecture/upscale" style={{ fontWeight: 700 }}>Architecture Upscale</a>
          <a href="/create/architecture/audio" style={{ fontWeight: 700 }}>Architecture Audio</a>
          <a href="/">Overview</a>
          <a href="/create">All domains</a>
          <a href="/library">Library</a>
          <a href="/profile">Profile</a>
          <a href="/tokens">Tokens</a>
          <a href="/admin">Admin</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
