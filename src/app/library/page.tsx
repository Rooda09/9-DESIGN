import { requireCurrentUser } from '@/lib/auth/request';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const user = await requireCurrentUser();
  const [prompts, scenarios] = await Promise.all([
    prisma.userPrompt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.userScenario.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  ]);

  return (
    <main style={{ minHeight: 'calc(100vh - 58px)', padding: 32, background: '#0b0e0f', color: '#edf2ee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1>Personal Architecture library</h1>
        <p style={{ color: '#aeb9b3' }}>Private prompt and clip-scenario records saved by {user.email}. Advanced library tools remain out of scope.</p>
        <h2 style={{ marginTop: 30 }}>Prompt packages</h2>
        {prompts.length === 0 ? (
          <p>No saved prompts yet. <a href="/create/architecture" style={{ color: '#9fc1ad' }}>Open the Architecture studio</a>.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
            {prompts.map(prompt => (
              <article key={prompt.id} style={{ padding: 16, border: '1px solid #30383b', borderRadius: 8, background: '#14191b' }}>
                <strong>{prompt.title}</strong>
                <span style={{ display: 'block', marginTop: 5, color: '#8fa099', fontSize: 13 }}>
                  {prompt.domainKey} - {prompt.createdAt.toISOString().slice(0, 10)}
                </span>
                <p style={{ color: '#c8d1cc', lineHeight: 1.55 }}>
                  {prompt.promptBody.length > 360 ? `${prompt.promptBody.slice(0, 360)}...` : prompt.promptBody}
                </p>
              </article>
            ))}
          </div>
        )}
        <h2 style={{ marginTop: 36 }}>Clip scenario packages</h2>
        {scenarios.length === 0 ? (
          <p>No saved scenarios yet. <a href="/create/architecture/clips" style={{ color: '#9fc1ad' }}>Open the Clip Scenario Builder</a>.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
            {scenarios.map(scenario => (
              <article key={scenario.id} style={{ padding: 16, border: '1px solid #30383b', borderRadius: 8, background: '#14191b' }}>
                <strong>{scenario.title}</strong>
                <span style={{ display: 'block', marginTop: 5, color: '#8fa099', fontSize: 13 }}>
                  {scenario.domainKey} CLIP SCENARIO - {scenario.createdAt.toISOString().slice(0, 10)}
                </span>
                <p style={{ color: '#c8d1cc', lineHeight: 1.55 }}>
                  {scenario.scenarioBody.length > 360 ? `${scenario.scenarioBody.slice(0, 360)}...` : scenario.scenarioBody}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
