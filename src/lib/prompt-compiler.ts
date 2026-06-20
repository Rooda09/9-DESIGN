import type { PromptCompileInput, PromptPackage } from './types';
import { buildAudioPrompt } from './audio-prompt';
import { buildUpscalePrompt } from './upscale-router';
import { getArchitectureEngine, getGeometryGuardOption } from './architecture/config';

const MAX_PROMPT_CHARS = 2000;
const MAX_MAIN_PROMPT_CHARS = 1850;

function compactText(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim();
}

function compactToLimit(input: string, maxLength: number): { text: string; truncated: boolean } {
  const compacted = compactText(input);
  if (compacted.length <= maxLength) return { text: compacted, truncated: false };

  const shortened = compacted
    .replace(/\bhighly detailed\b/gi, 'detailed')
    .replace(/\bprofessional quality\b/gi, 'professional')
    .replace(/\bphotorealistic realistic\b/gi, 'photorealistic')
    .replace(/\s*;\s*/g, '; ');

  if (shortened.length <= maxLength) return { text: shortened, truncated: false };

  const boundary = Math.max(
    shortened.lastIndexOf('. ', maxLength - 4),
    shortened.lastIndexOf('; ', maxLength - 4),
    shortened.lastIndexOf(', ', maxLength - 4)
  );
  const end = boundary > maxLength * 0.7 ? boundary + 1 : maxLength - 3;
  return { text: `${shortened.slice(0, end).trim()}...`, truncated: true };
}

function architectureGeometryInstructions(input: PromptCompileInput): string[] {
  const mode = input.geometryGuard ?? 'SEMI_FIXED_GEOMETRY';
  const common = 'Treat Geometry Guard as a hard scope boundary and keep all unlisted building elements unchanged.';

  switch (mode) {
    case 'FIXED_GEOMETRY':
      return [
        'Fixed Geometry: preserve exact building massing, plot boundary, floor count, roofline, structure, facade openings, proportions, setbacks, and camera angle.',
        'Do not add, remove, enlarge, relocate, or reshape floors, volumes, roofs, windows, doors, balconies, columns, roads, or site limits.',
        common
      ];
    case 'FREE_CONCEPT':
      return [
        'Free Concept: geometry may evolve substantially in response to the brief; use uploaded geometry only as contextual inspiration.',
        'Maintain plausible architectural scale, structure, circulation, site response, and buildable spatial logic.',
        'Do not claim the concept is construction-ready or code-compliant.'
      ];
    case 'FACADE_ONLY':
      return [
        'Facade Only: lock building massing, plot boundary, floor count, roofline, structure, opening locations and sizes, site geometry, and camera angle.',
        'Change only facade hierarchy, cladding systems, screens, shading devices, detailing, and surface articulation without moving openings.',
        common
      ];
    case 'MATERIAL_ONLY':
      return [
        'Material Only: lock all geometry, openings, landscape, composition, camera, and lighting direction.',
        'Change only material type, finish, color, texture scale, joints, reflectance, and weathering; keep construction logic believable.',
        common
      ];
    case 'INTERIOR_FINISH_ONLY':
      return [
        'Interior Finish Only: lock room dimensions, walls, columns, slabs, ceiling geometry, openings, circulation, built-in positions, and camera.',
        'Change only interior finishes, fixtures, loose furniture, textiles, color palette, and decorative lighting.',
        common
      ];
    case 'LANDSCAPE_ONLY':
      return [
        'Landscape Only: lock the building, facade, access points, plot boundary, levels, and camera.',
        'Change only planting, hardscape, water features, site furniture, garden structures, and landscape lighting within the existing site.',
        common
      ];
    case 'SEMI_FIXED_GEOMETRY':
    default:
      return [
        'Semi-Fixed Geometry: preserve primary massing, plot boundary, floor count, roofline, structural rhythm, main openings, proportions, and camera angle.',
        'Allow controlled facade articulation, secondary openings, materials, lighting, atmosphere, and landscape only when they do not change the core building.',
        common
      ];
  }
}

function domainLockInstructions(input: PromptCompileInput): string[] {
  if (input.domain === 'ARCHITECTURE') return architectureGeometryInstructions(input);

  const domain = input.domain;
  if (domain === 'PHOTOGRAPHY') {
    return [
      'Preserve exact product shape, proportions, material finish, label area, and front-facing identity.',
      'Do not deform the product, invent unreadable text, change packaging silhouette, or break lighting realism.'
    ];
  }
  return [
    'Preserve brand palette, tone, visual hierarchy, logo clear space, typography direction, and campaign consistency.',
    'Avoid generic AI visuals, random colors, distorted logo marks, weak hierarchy, or off-brand composition.'
  ];
}

function architectureQualityChecklist(input: PromptCompileInput): string[] {
  const selectedGroups = new Set(input.selections.map(selection => selection.groupKey));
  const checklist = [
    'Geometry Guard scope followed',
    'plot boundary and floor count consistent',
    'openings and roofline preserved where locked',
    'building typology and project type are legible',
    'design task is reflected without scope creep',
    'materials are physically believable with correct texture scale and joint logic',
    'facade system, roof type, and opening rhythm are architecturally coherent',
    'climate/context response is visible in shade, envelope, material, or landscape decisions',
    'camera, lens, and perspective remain coherent',
    'reference roles are used only for their assigned influence',
    'output purpose is clear for client review, exploration, or presentation',
    'no construction, permit, or code-compliance claim'
  ];

  if (selectedGroups.has('negative_constraints')) {
    checklist.push('selected negative constraints are explicitly avoided');
  }
  return checklist;
}

function qualityChecklist(input: PromptCompileInput): string[] {
  if (input.domain === 'ARCHITECTURE') return architectureQualityChecklist(input);

  const domain = input.domain;
  if (domain === 'PHOTOGRAPHY') {
    return ['product identity preserved', 'lighting realistic', 'shadow/reflection credible', 'commercial crop suitable', 'background supports product'];
  }
  return ['brand palette consistent', 'message clear', 'layout hierarchy strong', 'platform crop suitable', 'not generic'];
}

function architectureNegativeConstraints(input: PromptCompileInput): string[] {
  if (input.domain !== 'ARCHITECTURE') return [];

  return input.selections
    .filter(selection => selection.groupKey === 'negative_constraints')
    .map(selection => selection.promptFragment || selection.label || selection.value)
    .filter(Boolean);
}

function buildReferenceInstructions(input: PromptCompileInput): string[] {
  return (input.references ?? []).map(ref => {
    const strength = ref.lockStrength ?? 'MEDIUM';
    const roleLabels: Record<string, string> = {
      GEOMETRY_REFERENCE: 'Geometry reference',
      STYLE_REFERENCE: 'Style reference',
      MATERIAL_REFERENCE: 'Material reference',
      LIGHTING_REFERENCE: 'Lighting reference',
      CAMERA_REFERENCE: 'Camera reference',
      MOOD_REFERENCE: 'Mood reference',
      BRAND_REFERENCE: 'Brand reference',
      PRODUCT_REFERENCE: 'Product reference',
      MOTION_REFERENCE: 'Motion reference'
    };
    const role = roleLabels[ref.role] ?? ref.role;
    return `${role}: use reference ${ref.id} with ${strength} influence only for its assigned role; do not let it override Geometry Guard or unrelated controls.`;
  });
}

function buildStoryPrompt(input: PromptCompileInput): string | undefined {
  if (!input.storytelling) return undefined;
  const s = input.storytelling;
  return compactText([
    s.storyArc ? `Story arc: ${s.storyArc}.` : '',
    s.sceneBeginning ? `Opening: ${s.sceneBeginning}.` : '',
    s.sceneMiddle ? `Middle: ${s.sceneMiddle}.` : '',
    s.sceneEnd ? `Ending: ${s.sceneEnd}.` : '',
    s.cameraMotion ? `Camera motion: ${s.cameraMotion}.` : '',
    s.durationSeconds ? `Duration: ${s.durationSeconds} seconds.` : ''
  ].join(' '));
}

function buildNegativePrompt(input: PromptCompileInput): string {
  const base = [
    'low quality, blurry, distorted geometry, unrealistic scale, broken perspective, random text, watermark, duplicated objects, malformed people, inconsistent lighting'
  ];
  if (input.domain === 'ARCHITECTURE') {
    base.push(
      'changed plot boundary',
      'extra floors',
      'incorrect openings',
      'impossible structure',
      'fake facade logic',
      'warped structural grid',
      'inconsistent floor heights',
      'random window rhythm',
      'impossible cantilever',
      'plastic-looking stone',
      'wrong texture scale',
      'random cladding seams',
      'exaggerated lens distortion',
      'inaccurate shadows'
    );
    if (input.geometryGuard === 'FACADE_ONLY') {
      base.push('moved windows, changed roofline, altered massing, modified site');
    }
    if (input.geometryGuard === 'MATERIAL_ONLY') {
      base.push('geometry edits, moved objects, changed camera, changed landscape');
    }
    if (input.geometryGuard === 'INTERIOR_FINISH_ONLY') {
      base.push('moved walls, changed ceiling geometry, new openings, altered circulation');
    }
    if (input.geometryGuard === 'LANDSCAPE_ONLY') {
      base.push('changed building, modified facade, moved access, altered plot boundary');
    }
    base.push(...architectureNegativeConstraints(input));
  }
  if (input.domain === 'PHOTOGRAPHY') {
    base.push('deformed product, altered logo, unreadable label, fake reflections, bad shadow, melted packaging');
  }
  if (input.domain === 'BRANDING') {
    base.push('off-brand colors, generic AI look, distorted logo, random typography, weak hierarchy');
  }
  return compactText([...base, ...(input.negativeConstraints ?? [])].join(', '));
}

function buildArchitectureEnginePrompt(input: PromptCompileInput, mainPrompt: string, negativePrompt: string): string {
  const engine = getArchitectureEngine(input.engineKey);
  const guidance = engine?.guidance ?? 'Use precise architectural visualization instructions.';

  switch (input.engineKey) {
    case 'midjourney':
      return compactText(`${mainPrompt} ${guidance} --style raw --stylize 100 --no ${negativePrompt}`);
    case 'stable_diffusion':
      return compactText(`Positive prompt: ${mainPrompt} ${guidance} Negative prompt: ${negativePrompt}`);
    case 'gpt_image':
      return compactText(`Create the requested architectural image. ${mainPrompt} Editing policy: ${guidance} Avoid: ${negativePrompt}.`);
    case 'runway':
    case 'kling':
    case 'pika':
    case 'luma':
      return compactText(`${mainPrompt} Frame must remain stable and spatially coherent. ${guidance} Exclude: ${negativePrompt}.`);
    case 'flux':
    case 'leonardo':
    default:
      return compactText(`${mainPrompt} ${guidance} Negative prompt: ${negativePrompt}.`);
  }
}

export function compilePrompt(input: PromptCompileInput): PromptPackage {
  const selectionText = input.selections
    .map(s => s.promptFragment || `${s.groupKey}: ${s.label ?? s.value}`)
    .join(', ');

  const referenceInstructions = buildReferenceInstructions(input);
  const geometryInstructions = domainLockInstructions(input);
  const geometryMode = input.domain === 'ARCHITECTURE'
    ? getGeometryGuardOption(input.geometryGuard)?.label ?? 'Semi-Fixed Geometry'
    : undefined;
  const storyPrompt = buildStoryPrompt(input);
  const audioPrompt = input.audio?.required ? buildAudioPrompt(input.audio, input.domain) : undefined;
  const upscalePrompt = input.upscale?.required ? buildUpscalePrompt(input.upscale, input.domain) : undefined;

  const mainResult = compactToLimit([
    `Professional ${input.domain.toLowerCase()} ${input.workflowType} generation.`,
    input.templateTitle ? `Template: ${input.templateTitle}.` : '',
    input.templateDescription ? `Template direction: ${input.templateDescription}.` : '',
    input.userBrief ? `Brief: ${input.userBrief}.` : '',
    selectionText ? `Selected controls: ${selectionText}.` : '',
    geometryMode ? `Geometry Guard mode: ${geometryMode}.` : '',
    geometryInstructions.join(' '),
    referenceInstructions.join(' '),
    storyPrompt ? `Clip storytelling: ${storyPrompt}.` : '',
    'Produce a client-ready architectural visualization with coherent composition, realistic scale, physically plausible materials, and controlled detail.'
  ].join(' '), MAX_MAIN_PROMPT_CHARS);

  const negativePrompt = buildNegativePrompt(input);
  const warnings: string[] = [];
  if (mainResult.truncated) {
    warnings.push(`Main prompt was compressed to stay near ${MAX_MAIN_PROMPT_CHARS} characters.`);
  }

  const rawEnginePrompt = input.domain === 'ARCHITECTURE'
    ? buildArchitectureEnginePrompt(input, mainResult.text, negativePrompt)
    : compactText(`${mainResult.text} Negative prompt: ${negativePrompt}`);
  const engineResult = compactToLimit(rawEnginePrompt, MAX_PROMPT_CHARS);
  if (engineResult.truncated) {
    warnings.push(`Engine prompt was compressed to the ${MAX_PROMPT_CHARS}-character limit.`);
  }

  return {
    mainPrompt: mainResult.text,
    negativePrompt,
    enginePrompt: engineResult.text,
    referenceInstructions,
    geometryInstructions,
    lockInstructions: geometryInstructions,
    storyPrompt,
    audioPrompt,
    upscalePrompt,
    qualityChecklist: qualityChecklist(input),
    characterCount: engineResult.text.length,
    warnings
  };
}
