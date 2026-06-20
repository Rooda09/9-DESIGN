'use client';

import { useMemo, useState } from 'react';
import type { PromptPackage } from '@/lib/types';
import type {
  ArchitectureCreationData,
  ArchitectureDropdownGroupRecord,
  ArchitectureTemplateRecord
} from '@/lib/architecture/data';
import {
  initialArchitectureSelections,
  selectableArchitectureGroups,
  type ArchitectureSelectionState
} from '@/lib/architecture/defaults';
import {
  ARCHITECTURE_IMAGE_ENGINES,
  ARCHITECTURE_REFERENCE_ROLES,
  GEOMETRY_GUARD_OPTIONS,
  isArchitectureEngineKey,
  type ArchitectureEngineKey,
  type ArchitectureReferenceRole
} from '@/lib/architecture/config';
import type { GeometryGuardMode } from '@/lib/types';
import styles from './architecture-studio.module.css';

type ReferenceState = Record<ArchitectureReferenceRole, string>;

interface CompileResponse {
  promptPackage: PromptPackage;
  qualityGate: {
    score: number;
    blockingIssues: string[];
    warnings: string[];
    suggestedActions: string[];
  };
}

const EMPTY_REFERENCES: ReferenceState = {
  GEOMETRY_REFERENCE: '',
  STYLE_REFERENCE: '',
  MATERIAL_REFERENCE: '',
  LIGHTING_REFERENCE: '',
  CAMERA_REFERENCE: '',
  MOOD_REFERENCE: ''
};

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

function selectionSource(
  group: ArchitectureDropdownGroupRecord,
  template: ArchitectureTemplateRecord | undefined,
  selectedOptionId: string | undefined
) {
  const option = group.options.find(item => item.id === selectedOptionId);
  if (!option) return null;
  if (template?.defaultDropdowns[group.key] === option.value) return 'Template default';
  if (option.isDefault) return 'Admin default';
  if (group.isRequired && group.options[0]?.id === option.id) return 'Required fallback';
  return 'User selected';
}

export function ArchitecturePromptStudio({ data }: { data: ArchitectureCreationData }) {
  const firstTemplate = data.templates[0];
  const [templateId, setTemplateId] = useState(firstTemplate?.id ?? '');
  const [engineKey, setEngineKey] = useState<ArchitectureEngineKey>(
    firstTemplate?.defaultEngineKey && isArchitectureEngineKey(firstTemplate.defaultEngineKey)
      ? firstTemplate.defaultEngineKey
      : 'midjourney'
  );
  const [geometryGuard, setGeometryGuard] = useState<GeometryGuardMode>('SEMI_FIXED_GEOMETRY');
  const [brief, setBrief] = useState('');
  const [promptTitle, setPromptTitle] = useState(firstTemplate?.titleEn ?? 'Architecture prompt');
  const [selections, setSelections] = useState<ArchitectureSelectionState>(() => initialArchitectureSelections(firstTemplate, data.groups));
  const [references, setReferences] = useState<ReferenceState>(EMPTY_REFERENCES);
  const [result, setResult] = useState<CompileResponse | null>(null);
  const [status, setStatus] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const groups = useMemo(() => selectableArchitectureGroups(data.groups), [data.groups]);
  const selectedTemplate = data.templates.find(template => template.id === templateId);
  const selectedGuard = GEOMETRY_GUARD_OPTIONS.find(option => option.value === geometryGuard);

  function selectTemplate(nextId: string) {
    const template = data.templates.find(item => item.id === nextId);
    setTemplateId(nextId);
    setSelections(initialArchitectureSelections(template, data.groups));
    setPromptTitle(template?.titleEn ?? 'Architecture prompt');
    if (template?.defaultEngineKey && isArchitectureEngineKey(template.defaultEngineKey)) {
      setEngineKey(template.defaultEngineKey);
    }
    setResult(null);
    setStatus('');
  }

  async function compile() {
    setStatus('');
    setResult(null);

    if (!selectedTemplate) {
      setStatus('Choose a published Architecture template.');
      return;
    }
    if (brief.trim().length < 12) {
      setStatus('Add a project brief of at least 12 characters.');
      return;
    }

    const missingRequired = groups.find(group => group.isRequired && !selections[group.key]);
    if (missingRequired) {
      setStatus(`Choose a value for ${missingRequired.labelEn}.`);
      return;
    }

    const selectionPayload = groups.flatMap(group => {
      const optionId = selections[group.key];
      const option = group.options.find(item => item.id === optionId);
      return option ? [{ optionId: option.id, groupKey: group.key, value: option.value }] : [];
    });
    const referencePayload = ARCHITECTURE_REFERENCE_ROLES.flatMap(role => {
      const url = references[role.value].trim();
      return url
        ? [{ id: role.value.toLowerCase(), url, role: role.value, lockStrength: role.value === 'GEOMETRY_REFERENCE' ? 'STRICT' : 'HIGH' }]
        : [];
    });

    setIsCompiling(true);
    try {
      const response = await fetch('/api/prompts/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'ARCHITECTURE',
          templateId: selectedTemplate.id,
          workflowType: selectedTemplate.workflowType,
          engineKey,
          geometryGuard,
          userBrief: brief,
          selections: selectionPayload,
          references: referencePayload,
          negativeConstraints: []
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error ?? 'Prompt compilation failed.');
        return;
      }
      setResult(json);
      setStatus('Prompt package compiled.');
    } catch {
      setStatus('Prompt compilation could not reach the server.');
    } finally {
      setIsCompiling(false);
    }
  }

  async function savePrompt() {
    if (!result || !selectedTemplate) return;
    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/library/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promptTitle,
          templateId: selectedTemplate.id,
          promptPackage: result.promptPackage
        })
      });
      const json = await response.json();
      if (response.status === 401) {
        setStatus('Log in before saving this prompt to your library.');
        return;
      }
      if (!response.ok) {
        setStatus(json.error ?? 'Prompt could not be saved.');
        return;
      }
      setStatus('Prompt saved privately to your personal library. No generation job was created.');
    } catch {
      setStatus('Prompt saving could not reach the server.');
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
    anchor.download = 'architecture-prompt-package.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!data.domain) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <h1>Architecture domain is not configured</h1>
          <p>Create and activate the Architecture domain in the Phase 2 admin database before using this studio.</p>
          <a href="/admin/domains">Open domain administration</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a className={styles.backLink} href="/create">All domains / Architecture Studio</a>
          <p className={styles.eyebrow}>Primary MVP creation route</p>
          <h1>Architecture Studio for geometry-aware prompt packages</h1>
          <p className={styles.intro}>
            Use published Architecture templates, admin-managed dropdown defaults, Geometry Guard, and reference roles to
            compile a provider-ready prompt package. No image-generation API is called here.
          </p>
        </div>
        <div className={styles.domainBadge}>
          <span>Selected domain</span>
          <strong>{data.domain.labelEn}</strong>
          <small dir="rtl">{data.domain.labelAr}</small>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.controls}>
          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2>Template and engine</h2>
                <p>Published Architecture templates define the workflow, title, preferred engine, and dropdown defaults.</p>
              </div>
            </div>

            <label className={styles.field}>
              <span>Architecture template</span>
              <select value={templateId} onChange={event => selectTemplate(event.target.value)}>
                <option value="">Choose a published template</option>
                {data.templates.map(template => (
                  <option key={template.id} value={template.id}>{template.titleEn}</option>
                ))}
              </select>
            </label>

            {selectedTemplate ? (
              <div className={styles.infoPanel}>
                <strong>{selectedTemplate.titleEn}</strong>
                <span dir="rtl">{selectedTemplate.titleAr}</span>
                {selectedTemplate.bestFor ? <p><b>Best for:</b> {selectedTemplate.bestFor}</p> : null}
                {selectedTemplate.descriptionEn ? <p>{selectedTemplate.descriptionEn}</p> : null}
                {selectedTemplate.descriptionAr ? <p dir="rtl">{selectedTemplate.descriptionAr}</p> : null}
              </div>
            ) : (
              <p className={styles.notice}>No published Architecture template is selected.</p>
            )}

            <label className={styles.field}>
              <span>Image engine</span>
              <select value={engineKey} onChange={event => setEngineKey(event.target.value as ArchitectureEngineKey)}>
                {ARCHITECTURE_IMAGE_ENGINES.map(engine => (
                  <option key={engine.key} value={engine.key}>{engine.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2>Geometry Guard</h2>
                <p>Set the design-change boundary before compiling. This is the main Architecture safety control.</p>
              </div>
            </div>
            {selectedGuard ? (
              <div className={styles.scopePanel}>
                <strong>Current scope: {selectedGuard.label}</strong>
                <p>{selectedGuard.description}</p>
                <small>Best for: {selectedGuard.bestFor}</small>
              </div>
            ) : null}
            <div className={styles.choiceGrid}>
              {GEOMETRY_GUARD_OPTIONS.map(option => (
                <label key={option.value} className={`${styles.choice} ${geometryGuard === option.value ? styles.choiceActive : ''}`}>
                  <input
                    type="radio"
                    name="geometryGuard"
                    value={option.value}
                    checked={geometryGuard === option.value}
                    onChange={() => setGeometryGuard(option.value)}
                  />
                  <strong>{option.label}</strong>
                  <span>{option.bestFor}</span>
                  <small>{option.description}</small>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <h2>Database controls</h2>
                <p>Each dropdown loads active Architecture/admin records and starts from template defaults, admin defaults, or required fallback values.</p>
              </div>
            </div>
            {groups.length === 0 ? (
              <p className={styles.notice}>No active Architecture dropdown groups are available. Configure them in Admin.</p>
            ) : groups.map(group => {
              const selectedOption = group.options.find(option => option.id === selections[group.key]);
              const source = selectionSource(group, selectedTemplate, selections[group.key]);
              return (
                <div className={styles.dropdownBlock} key={group.id}>
                  <label className={styles.field}>
                    <span>
                      {group.labelEn}{group.isRequired ? ' *' : ''}
                      {group.isAdvanced ? <em className={styles.inlineTag}>Advanced</em> : null}
                    </span>
                    <small dir="rtl">{group.labelAr}</small>
                    {group.descriptionEn ? <small>{group.descriptionEn}</small> : null}
                    <select
                      value={selections[group.key] ?? ''}
                      onChange={event => setSelections(current => ({ ...current, [group.key]: event.target.value }))}
                    >
                      <option value="">Choose an option</option>
                      {group.options.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.labelEn}{option.isDefault ? ' (Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedOption ? (
                    <div className={styles.optionIntelligence}>
                      <div>
                        <strong>{selectedOption.labelEn}</strong>
                        {selectedOption.isDefault ? <span className={styles.defaultTag}>Default value</span> : null}
                        {source ? <span className={styles.defaultTag}>{source}</span> : null}
                      </div>
                      <span dir="rtl">{selectedOption.labelAr}</span>
                      <p><b>Best for:</b> {selectedOption.bestFor || 'General Architecture use'}</p>
                      <p>{selectedOption.descriptionEn || 'No English description provided.'}</p>
                      <p dir="rtl">{selectedOption.descriptionAr || 'No Arabic description provided.'}</p>
                    </div>
                  ) : null}

                  <details className={styles.optionDirectory}>
                    <summary>Review all labels, defaults, best-for notes, and descriptions</summary>
                    <div>
                      {group.options.map(option => (
                        <article key={option.id}>
                          <strong>{option.labelEn}{option.isDefault ? ' - Default' : ''}</strong>
                          <span dir="rtl">{option.labelAr}</span>
                          <p><b>Best for:</b> {option.bestFor || 'General Architecture use'}</p>
                          <p>{option.descriptionEn || 'No English description provided.'}</p>
                          <p dir="rtl">{option.descriptionAr || 'No Arabic description provided.'}</p>
                        </article>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>04</span>
              <div>
                <h2>Reference roles</h2>
                <p>Assign each reference a job. Geometry references are strict; style, material, lighting, camera, and mood references guide without overriding Geometry Guard.</p>
              </div>
            </div>
            <div className={styles.scopePanel}>
              <strong>Safe reference behavior</strong>
              <p>Reference URLs are used only as prompt instructions in this MVP. They are not uploaded, inspected, stored, or sent to an AI provider.</p>
            </div>
            <div className={styles.referenceGrid}>
              {ARCHITECTURE_REFERENCE_ROLES.map(role => (
                <label className={styles.field} key={role.value}>
                  <span>{role.label}</span>
                  <small>{role.description}</small>
                  <input
                    type="url"
                    placeholder="https://example.com/reference.jpg"
                    value={references[role.value]}
                    onChange={event => setReferences(current => ({ ...current, [role.value]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeading}>
              <span>05</span>
              <div>
                <h2>Project brief</h2>
                <p>Describe the design intent, project type, context, and output purpose.</p>
              </div>
            </div>
            <label className={styles.field}>
              <span>Architecture brief</span>
              <textarea
                rows={6}
                maxLength={1600}
                value={brief}
                onChange={event => setBrief(event.target.value)}
                placeholder="Example: Rework this coastal villa exterior into a restrained contemporary hospitality residence while preserving the approved massing and openings. Keep the current camera angle and focus on material, light, and facade refinement."
              />
              <small>{brief.length} / 1600 characters</small>
            </label>
            <button className={styles.primaryButton} type="button" onClick={compile} disabled={isCompiling || !selectedTemplate}>
              {isCompiling ? 'Compiling...' : 'Compile prompt package'}
            </button>
            {status ? <p className={styles.status}>{status}</p> : null}
          </div>
        </section>

        <aside className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.eyebrow}>Architecture prompt package</p>
              <h2>{result ? `${result.promptPackage.characterCount} characters` : 'Ready when you are'}</h2>
            </div>
            {result ? <span className={styles.score}>Quality {result.qualityGate.score}/100</span> : null}
          </div>

          {!result ? (
            <div className={styles.previewEmpty}>
              <strong>No compiled package yet</strong>
              <p>The preview will separate the main prompt, negative prompt, geometry instructions, reference instructions, engine-specific prompt, and quality checklist.</p>
            </div>
          ) : (
            <>
              <PreviewSection title="Main prompt" value={result.promptPackage.mainPrompt} />
              <PreviewSection title="Negative prompt" value={result.promptPackage.negativePrompt} />
              <ListSection title="Geometry preservation instructions" items={result.promptPackage.geometryInstructions} />
              <ListSection title="Reference image instructions" items={result.promptPackage.referenceInstructions} emptyLabel="No reference roles supplied." />
              <PreviewSection title="Engine-specific prompt" value={result.promptPackage.enginePrompt} />
              <ListSection title="Quality checklist" items={result.promptPackage.qualityChecklist} />
              {result.promptPackage.warnings.length > 0 ? (
                <ListSection title="Compiler warnings" items={result.promptPackage.warnings} />
              ) : null}

              <div className={styles.actions}>
                <button type="button" onClick={() => copyText(result.promptPackage.mainPrompt)}>Copy main</button>
                <button type="button" onClick={() => copyText(result.promptPackage.negativePrompt)}>Copy negative</button>
                <button type="button" onClick={exportPackage}>Export JSON</button>
              </div>

              <div className={styles.savePanel}>
                <p className={styles.saveNote}>
                  Saving stores this prompt package privately in your library. It does not call an AI engine, create a generation job, or debit tokens.
                </p>
                <label className={styles.field}>
                  <span>Library title</span>
                  <input value={promptTitle} maxLength={120} onChange={event => setPromptTitle(event.target.value)} />
                </label>
                <button className={styles.primaryButton} type="button" onClick={savePrompt} disabled={isSaving || promptTitle.trim().length < 2}>
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

function ListSection({ title, items, emptyLabel = 'None' }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <section className={styles.previewSection}>
      <h3>{title}</h3>
      {items.length > 0 ? (
        <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
      ) : <p>{emptyLabel}</p>}
    </section>
  );
}
