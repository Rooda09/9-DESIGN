'use client';

import { useMemo, useState } from 'react';
import {
  ARCHITECTURE_AUDIO_DURATIONS,
  architectureAudioMoods,
  architectureSfxDirections,
  type ArchitectureAudioDuration,
  type ArchitectureAudioMoodKey,
  type ArchitectureSfxDirectionKey
} from '@/config/architecture-upscale-audio';
import type { ArchitectureAudioPromptPackage } from '@/lib/architecture/audio/types';
import styles from '../architecture-studio.module.css';

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function ArchitectureAudioPromptWorkflow() {
  const [moodKey, setMoodKey] = useState<ArchitectureAudioMoodKey>('cinematic_ambient');
  const [sfxKey, setSfxKey] = useState<ArchitectureSfxDirectionKey>('subtle_wind');
  const [durationSeconds, setDurationSeconds] = useState<ArchitectureAudioDuration>(10);
  const [sceneDescription, setSceneDescription] = useState(
    'Short Architecture clip with slow exterior reveal, premium facade lighting, calm camera motion, and refined client-presentation mood.'
  );
  const [voiceoverPlaceholder, setVoiceoverPlaceholder] = useState('Optional one-sentence project title or location line, to be written later.');
  const [loopSeamless, setLoopSeamless] = useState(true);
  const [libraryTitle, setLibraryTitle] = useState('Architecture audio prompt package');
  const [result, setResult] = useState<ArchitectureAudioPromptPackage | null>(null);
  const [status, setStatus] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedMood = useMemo(
    () => architectureAudioMoods.find(mood => mood.key === moodKey),
    [moodKey]
  );

  async function compileAudioPrompt() {
    setIsCompiling(true);
    setStatus('');
    setResult(null);
    try {
      const response = await fetch('/api/architecture/audio/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodKey,
          sfxKey,
          durationSeconds,
          sceneDescription,
          voiceoverPlaceholder,
          loopSeamless
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error ?? 'Audio prompt compilation failed.');
        return;
      }
      setResult(json.audioPackage);
      setStatus('Architecture audio prompt package compiled. No audio provider API was called.');
    } catch {
      setStatus('Audio prompt compilation could not reach the server.');
    } finally {
      setIsCompiling(false);
    }
  }

  async function saveAudioPrompt() {
    if (!result) return;

    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/library/audio-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: libraryTitle,
          audioPackage: result
        })
      });
      const json = await response.json();
      if (response.status === 401) {
        setStatus('Log in before saving this audio package to your private library.');
        return;
      }
      if (!response.ok) {
        setStatus(json.error ?? 'Audio package could not be saved.');
        return;
      }
      setStatus('Audio package saved privately. No generation job was created and no tokens were charged.');
    } catch {
      setStatus('Audio package saving could not reach the server.');
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
    anchor.download = 'architecture-audio-prompt-package.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a className={styles.backLink} href="/create/architecture/clips">Architecture Clips / Audio Prompts</a>
          <p className={styles.eyebrow}>Phase 4C Architecture-only workflow</p>
          <h1>Architecture Clip Audio Prompt Workflow</h1>
          <p className={styles.intro}>
            Build a background audio prompt package for Architecture clips, with mood, SFX direction, timing, looping,
            voiceover placeholder, and negative audio constraints. This workflow does not call an audio provider.
          </p>
        </div>
        <div className={styles.domainBadge}>
          <span>Prompt workflow</span>
          <strong>Clip audio</strong>
          <small>{architectureAudioMoods.length} moods / {architectureSfxDirections.length} SFX options</small>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.controls}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Audio mood</h2>
                <p>Select the background audio character that supports the architectural story.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {architectureAudioMoods.map(mood => (
                <label
                  key={mood.key}
                  className={`${styles.choice} ${moodKey === mood.key ? styles.choiceActive : ''}`}
                >
                  <input
                    type="radio"
                    name="audioMood"
                    checked={moodKey === mood.key}
                    onChange={() => {
                      setMoodKey(mood.key);
                      setLibraryTitle(`${mood.labelEn} audio package`);
                      setResult(null);
                    }}
                  />
                  <strong>{mood.labelEn}</strong>
                  <span dir="rtl">{mood.labelAr}</span>
                  <small>{mood.bestFor}</small>
                </label>
              ))}
            </div>
            {selectedMood ? (
              <div className={styles.infoPanel}>
                <strong>{selectedMood.labelEn}</strong>
                <p>{selectedMood.descriptionEn}</p>
                <p dir="rtl">{selectedMood.descriptionAr}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>SFX direction</h2>
                <p>Keep effects subtle and spatial. Use no SFX when the clip needs only a music bed.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {architectureSfxDirections.map(direction => (
                <label
                  key={direction.key}
                  className={`${styles.choice} ${sfxKey === direction.key ? styles.choiceActive : ''}`}
                >
                  <input
                    type="radio"
                    name="sfxDirection"
                    checked={sfxKey === direction.key}
                    onChange={() => {
                      setSfxKey(direction.key);
                      setResult(null);
                    }}
                  />
                  <strong>{direction.labelEn}</strong>
                  <span dir="rtl">{direction.labelAr}</span>
                  <small>{direction.bestFor}</small>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Timing and scene context</h2>
                <p>Describe the clip context and timing so the audio supports the visual pace.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Scene description</span>
              <textarea
                rows={5}
                maxLength={1000}
                value={sceneDescription}
                onChange={event => {
                  setSceneDescription(event.target.value);
                  setResult(null);
                }}
              />
              <small>{sceneDescription.length} / 1000</small>
            </label>
            <label className={styles.field}>
              <span>Voiceover placeholder</span>
              <input
                maxLength={500}
                value={voiceoverPlaceholder}
                onChange={event => {
                  setVoiceoverPlaceholder(event.target.value);
                  setResult(null);
                }}
              />
            </label>
            <div className={styles.durationRow} aria-label="Audio duration">
              {ARCHITECTURE_AUDIO_DURATIONS.map(duration => (
                <button
                  key={duration}
                  type="button"
                  className={durationSeconds === duration ? styles.durationActive : ''}
                  onClick={() => {
                    setDurationSeconds(duration);
                    setResult(null);
                  }}
                >
                  {duration} seconds
                </button>
              ))}
            </div>
            <label className={styles.checkChoice}>
              <input
                type="checkbox"
                checked={loopSeamless}
                onChange={event => {
                  setLoopSeamless(event.target.checked);
                  setResult(null);
                }}
              />
              <span>
                <strong>Loop / seamless instruction</strong>
                <small>Ask the audio bed to loop cleanly for reels, cuts, or repeated preview exports.</small>
              </span>
            </label>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={compileAudioPrompt}
              disabled={isCompiling || sceneDescription.trim().length < 12}
            >
              {isCompiling ? 'Compiling...' : 'Compile audio prompt package'}
            </button>
            {status ? <p className={styles.status}>{status}</p> : null}
          </div>
        </section>

        <aside className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.eyebrow}>Architecture audio package</p>
              <h2>{result ? `${result.characterCount} characters` : 'Audio preview'}</h2>
            </div>
            {result ? <span className={styles.score}>{result.durationSeconds}s</span> : null}
          </div>

          {!result ? (
            <div className={styles.previewEmpty}>
              <strong>No compiled audio package yet</strong>
              <p>The preview will separate background prompt, SFX, voiceover placeholder, timing, loop instruction, and negative audio prompt.</p>
            </div>
          ) : (
            <>
              <PreviewSection title="Background audio prompt" value={result.backgroundAudioPrompt} />
              <PreviewSection title="SFX direction" value={result.sfxDirection} />
              <PreviewSection title="Voiceover placeholder" value={result.voiceoverPlaceholder} />
              <PreviewSection title="Timing notes" value={result.timingNotes} />
              <PreviewSection title="Loop / seamless instruction" value={result.loopSeamlessInstruction} />
              <PreviewSection title="Negative audio prompt" value={result.negativeAudioPrompt} />
              {result.warnings.length > 0 ? <ListSection title="Compiler warnings" items={result.warnings} /> : null}

              <div className={styles.actions}>
                <button type="button" onClick={() => copyText(result.backgroundAudioPrompt)}>Copy background</button>
                <button type="button" onClick={() => copyText(result.sfxDirection)}>Copy SFX</button>
                <button type="button" onClick={exportPackage}>Export JSON</button>
              </div>

              <div className={styles.savePanel}>
                <p className={styles.saveNote}>
                  Saving creates a private scenario-library record with an audio prompt only. It does not call an audio
                  provider, create a generation job, or debit tokens.
                </p>
                <label className={styles.field}>
                  <span>Library title</span>
                  <input value={libraryTitle} maxLength={120} onChange={event => setLibraryTitle(event.target.value)} />
                </label>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={saveAudioPrompt}
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
