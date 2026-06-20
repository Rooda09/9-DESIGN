import { loadArchitectureCreationData } from '@/lib/architecture/data';
import { ArchitecturePromptStudio } from './ArchitecturePromptStudio';

export const dynamic = 'force-dynamic';

export default async function ArchitectureCreatePage() {
  try {
    const data = await loadArchitectureCreationData();
    return <ArchitecturePromptStudio data={data} />;
  } catch (error) {
    console.error('Failed to load Architecture creation data.', error);
    return (
      <main style={{ minHeight: 'calc(100vh - 58px)', padding: 40, background: '#0b0e0f', color: '#edf2ee' }}>
        <h1>Architecture studio unavailable</h1>
        <p>Database-backed templates and dropdown records could not be loaded. Confirm PostgreSQL and the Phase 2 data setup.</p>
      </main>
    );
  }
}
