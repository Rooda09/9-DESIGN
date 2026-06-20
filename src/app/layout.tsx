export const metadata = {
  title: 'AI Creative Control Platform',
  description: 'Professional AI creative control platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
