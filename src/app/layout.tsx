export const metadata = {
  title: 'AI Creative Control Platform',
  description: 'Professional AI creative control platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc', color: '#111827' }}>
        <nav style={{ display: 'flex', gap: 16, padding: '16px 32px', borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
          <a href="/">Home</a>
          <a href="/create">Create</a>
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
