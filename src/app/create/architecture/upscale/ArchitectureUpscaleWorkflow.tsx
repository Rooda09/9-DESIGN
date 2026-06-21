'use client';

import { useMemo, useState } from 'react';
import {
  architectureUpscaleControls,
  architectureUpscaleIntents,
  type ArchitectureUpscaleControlKey,
  type ArchitectureUpscaleIntentKey
} from '@/config/architecture-upscale-audio';
import type { ArchitectureUpscalePromptPackage } from '@/lib/architecture/upscale/types';
import styles from '../architecture-studio.module.css';

const defaultControlKeys = architectureUpscaleControls.map(control => control.key);

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function ArchitectureUpscaleWorkflow() {
  const [intentKey, setIntentKey] = useState<ArchitectureUpscaleIntentKey>('enhance_render_realism');
  const [sourceImageDescription, setSourceImageDescription] = useState(
    'Architecture exterior render with approved massing, facade openings, material palette, landscape context, and client-review composition.'
  );
  const [outputUseNote, setOutputUseNote] = useState('Client presentation board and high-resolution review export.');
  const [qualityControlKeys, setQualityControlKeys] = useState<ArchitectureUpscaleControlKey[]>(defaultControlKeys);
  const [libraryTitle, setLibraryTitle] = useState('Architecture upscale prompt package');
  const [result, setResult] = useState<ArchitectureUpscalePromptPackage | null>(null);
  const [status, setStatus] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedIntent = useMemo(
    () => architectureUpscaleIntents.find(intent => intent.key === intentKey),
    [intentKey]
  );

  function toggleControl(key: ArchitectureUpscaleControlKey, checked: boolean) {
    setQualityControlKeys(current => checked
      ? Array.from(new Set([...current, key]))
      : current.filter(item => item !== key)
    );
    setResult(null);
  }

  async function compileUpscalePrompt() {
    setIsCompiling(true);
    setStatus('');
    setResult(null);
    try {
      const response = await fetch('/api/architecture/upscale/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentKey,
          sourceImageDescription,
          qualityControlKeys,
          outputUseNote
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error ?? 'Upscale prompt compilation failed.');
        return;
      }
      setResult(json.upscalePackage);
      setStatus('Architecture upscale prompt package compiled. No provider API was called.');
    } catch {
      setStatus('Upscale prompt compilation could not reach the server.');
    } finally {
      setIsCompiling(false);
    }
  }

  async function saveUpscalePrompt() {
    if (!result) return;

    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/library/upscale-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: libraryTitle,
          upscalePackage: result
        })
      });
      const json = await response.json();
      if (response.status === 401) {
        setStatus('Log in before saving this upscale package to your private library.');
        return;
      }
      if (!response.ok) {
        setStatus(json.error ?? 'Upscale package could not be saved.');
        return;
      }
      setStatus('Upscale package saved privately. No generation job was created and no tokens were charged.');
    } catch {
      setStatus('Upscale package saving could not reach the server.');
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
    anchor.download = 'architecture-upscale-prompt-package.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a className={styles.backLink} href="/create/architecture">Architecture Studio / Upscale Prompts</a>
          <p className={styles.eyebrow}>Phase 4C Architecture-only workflow</p>
          <h1>Architecture Upscale Prompt Workflow</h1>
          <p className={styles.intro}>
            Build a provider-ready prompt package for enhancing architectural images and renders while protecting
            geometry, facade details, material fidelity, scale, and design intent. This workflow does not upload images
            or call any upscale provider.
          </p>
        </div>
        <div className={styles.domainBadge}>
          <span>Prompt workflow</span>
          <strong>Upscale only</strong>
          <small>{architectureUpscaleIntents.length} Architecture intents</small>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.controls}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Upscale intent</h2>
                <p>Select the primary image-improvement objective.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {architectureUpscaleIntents.map(intent => (
                <label
                  key={intent.key}
                  className={`${styles.choice} ${intentKey === intent.key ? styles.choiceActive : ''}`}
                >
                  <input
                    type="radio"
                    name="upscaleIntent"
                    checked={intentKey === intent.key}
                    onChange={() => {
                      setIntentKey(intent.key);
                      setLibraryTitle(`${intent.labelEn} package`);
                      setResult(null);
                    }}
                  />
                  <strong>{intent.labelEn}</strong>
                  <span dir="rtl">{intent.labelAr}</span>
                  <small>{intent.bestFor}</small>
                </label>
              ))}
            </div>
            {selectedIntent ? (
              <div className={styles.infoPanel}>
                <strong>{selectedIntent.labelEn}</strong>
                <p>{selectedIntent.descriptionEn}</p>
                <p dir="rtl">{selectedIntent.descriptionAr}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>Source image context</h2>
                <p>Describe the render or image being enhanced. No media is uploaded in Phase 4C.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Source image description</span>
              <textarea
                rows={5}
                maxLength={1000}
                value={sourceImageDescription}
                onChange={event => {
                  setSourceImageDescription(event.target.value);
                  setResult(null);
                }}
              />
              <small>{sourceImageDescription.length} / 1000</small>
            </label>
            <label className={styles.field}>
              <span>Output format notes</span>
              <input
                maxLength={500}
                value={outputUseNote}
                onChange={event => {
                  setOutputUseNote(event.target.value);
                  setResult(null);
                }}
              />
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Image quality controls</h2>
                <p>Keep architectural facts stable while improving clarity and realism.</p>
              </div>
            </div>
            <div className={styles.continuityGrid}>
              {architectureUpscaleControls.map(control => (
                <label key={control.key} className={styles.checkChoice}>
                  <input
                    type="checkbox"
                    checked={qualityControlKeys.includes(control.key)}
                    onChange={event => toggleControl(control.key, event.target.checked)}
                  />
                  <span>
                    <strong>{control.labelEn}</strong>
                    <small>{control.descriptionEn}</small>
                  </span>
                </label>
              ))}
            </div>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={compileUpscalePrompt}
              disabled={isCompiling || qualityControlKeys.length === 0 || sourceImageDescription.trim().length < 12}
            >
              {isCompiling ? 'Compiling...' : 'Compile upscale prompt package'}
            </button>
            {status ? <p className={styles.status}>{status}</p> : null}
          </div>
        </section>

        <aside className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.eyebrow}>Architecture upscale package</p>
              <h2>{result ? `${result.characterCount} characters` : 'Upscale preview'}</h2>
            </div>
            {result ? <span className={styles.score}>Prompt only</span> : null}
          </div>

          {!result ? (
            <div className={styles.previewEmpty}>
              <strong>No compiled upscale package yet</strong>
              <p>The preview will separate objective, preservation, enhancement, negative prompt, output notes, and checks.</p>
            </div>
          ) : (
            <>
              <PreviewSection title="Upscale objective" value={result.upscaleObjective} />
              <ListSection title="Preservation instructions" items={result.preservationInstructions} />
              <ListSection title="Enhancement instructions" items={result.enhancementInstructions} />
              <PreviewSection title="Negative upscale prompt" value={result.negativeUpscalePrompt} />
              <PreviewSection title="Output format notes" value={result.outputFormatNotes} />
              <ListSection title="Quality checklist" items={result.qualityChecklist} />
              {result.warnings.length > 0 ? <ListSection title="Compiler warnings" items={result.warnings} /> : null}

              <div className={styles.actions}>
                <button type="button" onClick={() => copyText(result.upscaleObjective)}>Copy objective</button>
                <button type="button" onClick={() => copyText(result.enhancementInstructions.join('\n'))}>Copy enhancement</button>
                <button type="button" onClick={exportPackage}>Export JSON</button>
              </div>

              <div className={styles.savePanel}>
                <p className={styles.saveNote}>
                  Saving creates a private prompt-library record only. It does not upload images, call an upscale provider,
                  create a generation job, or debit tokens.
                </p>
                <label className={styles.field}>
                  <span>Library title</span>
                  <input value={libraryTitle} maxLength={120} onChange={event => setLibraryTitle(event.target.value)} />
                </label>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={saveUpscalePrompt}
                  disabled={isSaving || libraryTitle.trim().length < 2}
                >
                  {isSaving ? 'Saving...' : 'Save to prompt library'}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
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
