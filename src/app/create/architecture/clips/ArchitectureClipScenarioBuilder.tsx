'use client';

import { useMemo, useState } from 'react';
import {
  ARCHITECTURE_CAMERA_MOVEMENTS,
  ARCHITECTURE_CLIP_DURATIONS,
  ARCHITECTURE_CLIP_ENGINES,
  ARCHITECTURE_CONTINUITY_CONTROLS,
  type ArchitectureCameraMovementKey,
  type ArchitectureClipDuration,
  type ArchitectureClipEngineKey,
  type ArchitectureContinuityState
} from '@/config/architecture-clips';
import type {
  ArchitectureClipCreationData,
  ArchitectureClipScenarioRecord
} from '@/lib/architecture/clips/data';
import type {
  ArchitectureClipScenarioPackage,
  ArchitectureClipStory
} from '@/lib/architecture/clips/types';
import styles from '../architecture-studio.module.css';

function storyFromScenario(scenario: ArchitectureClipScenarioRecord): ArchitectureClipStory {
  return {
    openingShot: scenario.openingShot,
    subjectFocus: scenario.subjectFocus,
    cameraMovement: scenario.cameraMovement,
    atmosphere: scenario.atmosphere,
    architecturalDetail: scenario.architecturalDetail,
    closingShot: scenario.closingShot
  };
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function ArchitectureClipScenarioBuilder({ data }: { data: ArchitectureClipCreationData }) {
  const firstScenario = data.scenarios[0];
  const [scenarioId, setScenarioId] = useState(firstScenario?.id ?? '');
  const [engineKey, setEngineKey] = useState<ArchitectureClipEngineKey>('kling');
  const [durationSeconds, setDurationSeconds] = useState<ArchitectureClipDuration>(
    firstScenario?.durationSeconds ?? 8
  );
  const [story, setStory] = useState<ArchitectureClipStory>(
    firstScenario ? storyFromScenario(firstScenario) : {
      openingShot: '',
      subjectFocus: '',
      cameraMovement: 'slow_dolly_in',
      atmosphere: '',
      architecturalDetail: '',
      closingShot: ''
    }
  );
  const [continuity, setContinuity] = useState<ArchitectureContinuityState>(
    firstScenario?.continuityDefaults ?? {
      preserveBuildingGeometry: true,
      preserveFacadeOpenings: true,
      preserveMaterialPalette: true,
      preserveLightingMood: true,
      preserveCameraDirection: true
    }
  );
  const [libraryTitle, setLibraryTitle] = useState(firstScenario?.titleEn ?? 'Architecture clip scenario');
  const [result, setResult] = useState<ArchitectureClipScenarioPackage | null>(null);
  const [status, setStatus] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedScenario = useMemo(
    () => data.scenarios.find(scenario => scenario.id === scenarioId),
    [data.scenarios, scenarioId]
  );
  const selectedMovement = ARCHITECTURE_CAMERA_MOVEMENTS.find(
    movement => movement.key === story.cameraMovement
  );

  function selectScenario(nextId: string) {
    const scenario = data.scenarios.find(item => item.id === nextId);
    setScenarioId(nextId);
    if (!scenario) return;
    setStory(storyFromScenario(scenario));
    setDurationSeconds(scenario.durationSeconds);
    setContinuity(scenario.continuityDefaults);
    setLibraryTitle(scenario.titleEn);
    setResult(null);
    setStatus('');
  }

  function updateStory<K extends keyof ArchitectureClipStory>(
    key: K,
    value: ArchitectureClipStory[K]
  ) {
    setStory(current => ({ ...current, [key]: value }));
    setResult(null);
  }

  async function compileScenario() {
    if (!selectedScenario) {
      setStatus('Choose an Architecture clip scenario.');
      return;
    }

    setIsCompiling(true);
    setStatus('');
    setResult(null);
    try {
      const response = await fetch('/api/scenarios/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioKey: selectedScenario.key,
          scenarioTitle: selectedScenario.titleEn,
          scenarioPrompt: selectedScenario.scenarioPrompt,
          engineKey,
          durationSeconds,
          story,
          continuity
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error ?? 'Clip scenario compilation failed.');
        return;
      }
      setResult(json.scenarioPackage);
      setStatus('Architecture clip scenario package compiled. No video API was called.');
    } catch {
      setStatus('Clip scenario compilation could not reach the server.');
    } finally {
      setIsCompiling(false);
    }
  }

  async function saveScenario() {
    if (!result || !selectedScenario) return;

    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/library/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: libraryTitle,
          sourceScenarioId: selectedScenario.id,
          scenarioPackage: result
        })
      });
      const json = await response.json();
      if (response.status === 401) {
        setStatus('Log in before saving this scenario to your private library.');
        return;
      }
      if (!response.ok) {
        setStatus(json.error ?? 'Scenario could not be saved.');
        return;
      }
      setStatus('Scenario saved privately. No generation job was created and no tokens were charged.');
    } catch {
      setStatus('Scenario saving could not reach the server.');
    } finally {
      setIsSaving(false);
    }
  }

  function exportPackage() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'architecture-clip-scenario-package.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!firstScenario) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <h1>No Architecture clip scenarios are available</h1>
          <p>Run the Phase 4B seed or publish Architecture clip scenarios through Admin.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a className={styles.backLink} href="/create/architecture">Architecture Studio / Clip Scenario Builder</a>
          <p className={styles.eyebrow}>Phase 4B Architecture-only workflow</p>
          <h1>Architecture Clip Scenario Builder</h1>
          <p className={styles.intro}>
            Structure a short architectural clip, control camera and continuity, and compile an engine-specific video
            prompt package. This workflow does not call Kling, Veo, WAN 2.6, or any other video provider.
          </p>
        </div>
        <div className={styles.domainBadge}>
          <span>Scenario source</span>
          <strong>{data.source === 'database' ? 'Admin database' : 'Curated fallback'}</strong>
          <small>{data.scenarios.length} Architecture scenarios</small>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.controls}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Scenario type</h2>
                <p>Choose a curated Architecture scenario, then refine its six-part storytelling structure.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Architecture clip scenario</span>
              <select value={scenarioId} onChange={event => selectScenario(event.target.value)}>
                {data.scenarios.map(scenario => (
                  <option key={scenario.id} value={scenario.id}>{scenario.titleEn}</option>
                ))}
              </select>
            </label>
            {selectedScenario ? (
              <div className={styles.infoPanel}>
                <strong>{selectedScenario.titleEn}</strong>
                <span dir="rtl">{selectedScenario.titleAr}</span>
                <p><b>Best for:</b> {selectedScenario.bestFor}</p>
                <p>{selectedScenario.descriptionEn}</p>
                <p dir="rtl">{selectedScenario.descriptionAr}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>Storytelling structure</h2>
                <p>Each field becomes a specific shot instruction in the compiled scenario package.</p>
              </div>
            </div>
            <div className={styles.storyGrid}>
              <StoryField label="Opening shot" value={story.openingShot} onChange={value => updateStory('openingShot', value)} />
              <StoryField label="Subject focus" value={story.subjectFocus} onChange={value => updateStory('subjectFocus', value)} />
              <StoryField label="Atmosphere" value={story.atmosphere} onChange={value => updateStory('atmosphere', value)} />
              <StoryField label="Architectural detail" value={story.architecturalDetail} onChange={value => updateStory('architecturalDetail', value)} />
              <StoryField label="Closing shot" value={story.closingShot} onChange={value => updateStory('closingShot', value)} />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Camera movement</h2>
                <p>Use one primary camera path to reduce geometry drift and temporal ambiguity.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {ARCHITECTURE_CAMERA_MOVEMENTS.map(movement => (
                <label
                  key={movement.key}
                  className={`${styles.choice} ${story.cameraMovement === movement.key ? styles.choiceActive : ''}`}
                >
                  <input
                    type="radio"
                    name="cameraMovement"
                    checked={story.cameraMovement === movement.key}
                    onChange={() => updateStory('cameraMovement', movement.key)}
                  />
                  <strong>{movement.label}</strong>
                  <span>{movement.bestFor}</span>
                  <small>{movement.prompt}</small>
                </label>
              ))}
            </div>
            {selectedMovement ? (
              <div className={styles.scopePanel}>
                <strong>Selected path: {selectedMovement.label}</strong>
                <p>{selectedMovement.prompt}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>04</span>
              <div>
                <h2>Engine and duration</h2>
                <p>These are prompt-format placeholders only. They do not create provider jobs or spend tokens.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {ARCHITECTURE_CLIP_ENGINES.map(engine => (
                <label
                  key={engine.key}
                  className={`${styles.choice} ${engineKey === engine.key ? styles.choiceActive : ''}`}
                >
                  <input
                    type="radio"
                    name="clipEngine"
                    checked={engineKey === engine.key}
                    onChange={() => setEngineKey(engine.key)}
                  />
                  <strong>{engine.name}</strong>
                  <small>{engine.guidance}</small>
                </label>
              ))}
            </div>
            <div className={styles.durationRow} aria-label="Clip duration">
              {ARCHITECTURE_CLIP_DURATIONS.map(duration => (
                <button
                  key={duration}
                  type="button"
                  className={durationSeconds === duration ? styles.durationActive : ''}
                  onClick={() => setDurationSeconds(duration)}
                >
                  {duration} seconds
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>05</span>
              <div>
                <h2>Architecture continuity</h2>
                <p>Keep critical architectural facts fixed across every frame. Disable a lock only when the scenario explicitly requires change.</p>
              </div>
            </div>
            <div className={styles.continuityGrid}>
              {ARCHITECTURE_CONTINUITY_CONTROLS.map(control => (
                <label key={control.key} className={styles.checkChoice}>
                  <input
                    type="checkbox"
                    checked={continuity[control.key]}
                    onChange={event => setContinuity(current => ({
                      ...current,
                      [control.key]: event.target.checked
                    }))}
                  />
                  <span>
                    <strong>{control.label}</strong>
                    <small>{control.description}</small>
                  </span>
                </label>
              ))}
            </div>
            <button className={styles.primaryButton} type="button" onClick={compileScenario} disabled={isCompiling}>
              {isCompiling ? 'Compiling...' : 'Compile clip scenario package'}
            </button>
            {status ? <p className={styles.status}>{status}</p> : null}
          </div>
        </section>

        <aside className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.eyebrow}>Architecture clip package</p>
              <h2>{result ? `${result.characterCount} characters` : 'Scenario preview'}</h2>
            </div>
            {result ? <span className={styles.score}>{result.durationSeconds}s / {result.engineKey}</span> : null}
          </div>

          {!result ? (
            <div className={styles.previewEmpty}>
              <strong>No compiled clip package yet</strong>
              <p>The preview will separate storytelling, shot list, camera motion, continuity, negative video prompt, engine prompt, and quality checks.</p>
            </div>
          ) : (
            <>
              <PreviewSection title="Scenario title" value={result.scenarioTitle} />
              <PreviewSection title="Storytelling prompt" value={result.storytellingPrompt} />
              <ListSection title="Shot list" items={result.shotList} />
              <PreviewSection title="Camera movement prompt" value={result.cameraMovementPrompt} />
              <ListSection title="Continuity instructions" items={result.continuityInstructions} />
              <PreviewSection title="Negative video prompt" value={result.negativeVideoPrompt} />
              <PreviewSection title="Engine-specific video prompt" value={result.engineVideoPrompt} />
              <ListSection title="Quality checklist" items={result.qualityChecklist} />
              {result.warnings.length > 0 ? <ListSection title="Compiler warnings" items={result.warnings} /> : null}

              <div className={styles.actions}>
                <button type="button" onClick={() => copyText(result.storytellingPrompt)}>Copy story</button>
                <button type="button" onClick={() => copyText(result.engineVideoPrompt)}>Copy engine prompt</button>
                <button type="button" onClick={exportPackage}>Export JSON</button>
              </div>

              <div className={styles.savePanel}>
                <p className={styles.saveNote}>
                  Saving creates a private scenario-library record only. It does not call a video provider, create a generation job, or debit tokens.
                </p>
                <label className={styles.field}>
                  <span>Scenario library title</span>
                  <input value={libraryTitle} maxLength={120} onChange={event => setLibraryTitle(event.target.value)} />
                </label>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={saveScenario}
                  disabled={isSaving || libraryTitle.trim().length < 2}
                >
                  {isSaving ? 'Saving...' : 'Save to scenario library'}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

function StoryField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea rows={4} maxLength={500} value={value} onChange={event => onChange(event.target.value)} />
      <small>{value.length} / 500</small>
    </label>
  );
}

function PreviewSection({ title, value }: { title: string; value: string }) {
  return (
    <section className={styles.previewSection}>
      <div>
        <h3>{title}</h3>
        <button type="button" onClick={() => copyText(value)}>Copy</button>
      </div>
      <p>{value}</p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className={styles.previewSection}>
      <h3>{title}</h3>
      <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
