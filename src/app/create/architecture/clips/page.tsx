import { loadArchitectureClipCreationData } from '@/lib/architecture/clips/data';
import { ArchitectureClipScenarioBuilder } from './ArchitectureClipScenarioBuilder';

export const dynamic = 'force-dynamic';

export default async function ArchitectureClipsPage() {
  const data = await loadArchitectureClipCreationData();
  return <ArchitectureClipScenarioBuilder data={data} />;
}
