import {
  ARCHITECTURE_CONTINUITY_CONTROLS,
  getArchitectureCameraMovement,
  getArchitectureClipEngine,
  getArchitectureClipScenario
} from '../../../config/architecture-clips';
import type {
  ArchitectureClipCompileInput,
  ArchitectureClipScenarioPackage
} from './types';

const MAX_ENGINE_PROMPT_CHARACTERS = 2000;

function compactText(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\s*;\s*/g, '; ').trim();
}

function compactToLimit(value: string, maximum: number) {
  const compacted = compactText(value);
  if (compacted.length <= maximum) return { text: compacted, truncated: false };

  const boundary = Math.max(
    compacted.lastIndexOf('. ', maximum - 4),
    compacted.lastIndexOf('; ', maximum - 4),
    compacted.lastIndexOf(', ', maximum - 4)
  );
  const end = boundary > maximum * 0.7 ? boundary + 1 : maximum - 3;
  return { text: `${compacted.slice(0, end).trim()}...`, truncated: true };
}

function buildShotList(input: ArchitectureClipCompileInput) {
  return [
    `Opening shot: ${compactText(input.story.openingShot)}`,
    `Subject focus: ${compactText(input.story.subjectFocus)}`,
    `Camera movement: ${compactText(getArchitectureCameraMovement(input.story.cameraMovement)?.prompt ?? input.story.cameraMovement)}`,
    `Atmosphere: ${compactText(input.story.atmosphere)}`,
    `Architectural detail: ${compactText(input.story.architecturalDetail)}`,
    `Closing shot: ${compactText(input.story.closingShot)}`
  ];
}

function buildContinuityInstructions(input: ArchitectureClipCompileInput) {
  const selected = ARCHITECTURE_CONTINUITY_CONTROLS
    .filter(control => input.continuity[control.key])
    .map(control => control.instruction);

  return [
    ...selected,
    'Maintain temporal coherence between frames: no object popping, duplicated elements, texture crawling, geometry drift, or unexplained environmental changes.'
  ];
}

function buildNegativeVideoPrompt(input: ArchitectureClipCompileInput) {
  const negatives = [
    'geometry morphing',
    'building deformation',
    'warped verticals',
    'extra floors',
    'moving windows or doors',
    'disappearing facade elements',
    'texture crawling',
    'material flicker',
    'random reflections',
    'lighting flicker',
    'camera teleportation',
    'horizon drift',
    'speed ramps',
    'frame interpolation artifacts',
    'duplicated people',
    'floating objects',
    'fake text',
    'watermark',
    'low detail'
  ];

  if (!input.continuity.preserveLightingMood) {
    negatives.splice(negatives.indexOf('lighting flicker'), 1);
    negatives.push('abrupt exposure jumps', 'implausible shadow movement');
  }
  if (!input.continuity.preserveMaterialPalette) {
    negatives.push('unapproved material changes outside the intended transition');
  }

  return compactText(negatives.join(', '));
}

function buildQualityChecklist(input: ArchitectureClipCompileInput) {
  const checklist = [
    'Scenario has a readable opening, subject focus, architectural detail, and closing frame',
    'Camera movement is physically plausible and matches the selected duration',
    'Building scale, structure, verticals, and perspective remain believable',
    'No geometry drift, facade mutation, object popping, texture crawl, or frame flicker',
    'Materials, atmosphere, occupancy, landscape, and reflections behave consistently',
    'The final frame is composed and usable for review or editing',
    'The package is a prompt-planning artifact only and makes no claim of built, code-compliant, or construction-ready output'
  ];

  const enabled = ARCHITECTURE_CONTINUITY_CONTROLS
    .filter(control => input.continuity[control.key])
    .map(control => `${control.label} verified across the complete shot`);

  return [...enabled, ...checklist];
}

function enginePrefix(input: ArchitectureClipCompileInput) {
  if (input.engineKey === 'kling') {
    return 'Kling architecture video prompt';
  }
  if (input.engineKey === 'veo') {
    return 'Veo architecture video prompt';
  }
  return 'WAN 2.6 architecture video prompt';
}

export function compileArchitectureClipScenario(
  input: ArchitectureClipCompileInput
): ArchitectureClipScenarioPackage {
  const scenario = getArchitectureClipScenario(input.scenarioKey);
  const movement = getArchitectureCameraMovement(input.story.cameraMovement);
  const engine = getArchitectureClipEngine(input.engineKey);
  if (!scenario || !movement || !engine) {
    throw new Error('Unsupported Architecture clip scenario configuration.');
  }

  const shotList = buildShotList(input);
  const continuityInstructions = buildContinuityInstructions(input);
  const storytellingPrompt = compactText([
    `${input.scenarioTitle}, ${input.durationSeconds}-second Architecture clip.`,
    input.scenarioPrompt,
    ...shotList
  ].join(' '));
  const cameraMovementPrompt = compactText(
    `${movement.label}: ${movement.prompt} Complete the move within ${input.durationSeconds} seconds with a composed final hold.`
  );
  const negativeVideoPrompt = buildNegativeVideoPrompt(input);
  const qualityChecklist = buildQualityChecklist(input);
  const rawEnginePrompt = compactText([
    `${enginePrefix(input)}.`,
    storytellingPrompt,
    cameraMovementPrompt,
    `Continuity: ${continuityInstructions.join(' ')}`,
    `Engine guidance: ${engine.guidance}`,
    `Scenario guidance: ${scenario.engineHints[input.engineKey]}`,
    `Avoid: ${negativeVideoPrompt}.`
  ].join(' '));
  const enginePrompt = compactToLimit(rawEnginePrompt, MAX_ENGINE_PROMPT_CHARACTERS);

  return {
    scenarioTitle: input.scenarioTitle,
    scenarioKey: input.scenarioKey,
    engineKey: input.engineKey,
    durationSeconds: input.durationSeconds,
    storytellingPrompt,
    shotList,
    cameraMovementPrompt,
    continuityInstructions,
    negativeVideoPrompt,
    engineVideoPrompt: enginePrompt.text,
    qualityChecklist,
    characterCount: enginePrompt.text.length,
    warnings: enginePrompt.truncated
      ? ['Engine-specific video prompt was compacted to the 2,000-character limit. Review the shortened result.']
      : []
  };
}
