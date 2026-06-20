import type { DomainKey, PromptCompileInput, PromptPackage } from './types';
import { buildAudioPrompt } from './audio-prompt';
import { buildUpscalePrompt } from './upscale-router';

const MAX_PROMPT_CHARS = 2000;

function compactText(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim();
}

function domainLockInstructions(domain: DomainKey): string[] {
  if (domain === 'ARCHITECTURE') {
    return [
      'Preserve original massing, plot boundary, floor count, roofline, facade openings, proportions, and main camera angle.',
      'Do not add extra floors, towers, windows, balconies, roof shapes, roads, or change site limits unless explicitly requested.',
      'Apply creativity only to approved style, facade treatment, material palette, lighting, atmosphere, landscape, or presentation level.'
    ];
  }
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

function qualityChecklist(domain: DomainKey): string[] {
  if (domain === 'ARCHITECTURE') {
    return ['geometry preserved', 'boundary respected', 'floor count consistent', 'material believable', 'scale realistic', 'client-ready composition'];
  }
  if (domain === 'PHOTOGRAPHY') {
    return ['product identity preserved', 'lighting realistic', 'shadow/reflection credible', 'commercial crop suitable', 'background supports product'];
  }
  return ['brand palette consistent', 'message clear', 'layout hierarchy strong', 'platform crop suitable', 'not generic'];
}

function buildReferenceInstructions(input: PromptCompileInput): string[] {
  return (input.references ?? []).map(ref => {
    const strength = ref.lockStrength ?? 'MEDIUM';
    return `${ref.role}: use uploaded reference ${ref.id} with ${strength} lock strength.`;
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
    base.push('changed plot boundary, extra floors, incorrect openings, impossible structure, fake facade logic');
  }
  if (input.domain === 'PHOTOGRAPHY') {
    base.push('deformed product, altered logo, unreadable label, fake reflections, bad shadow, melted packaging');
  }
  if (input.domain === 'BRANDING') {
    base.push('off-brand colors, generic AI look, distorted logo, random typography, weak hierarchy');
  }
  return compactText([...base, ...(input.negativeConstraints ?? [])].join(', '));
}

export function compilePrompt(input: PromptCompileInput): PromptPackage {
  const selectionText = input.selections
    .map(s => s.promptFragment || `${s.groupKey}: ${s.label ?? s.value}`)
    .join(', ');

  const referenceInstructions = buildReferenceInstructions(input);
  const lockInstructions = domainLockInstructions(input.domain);
  const storyPrompt = buildStoryPrompt(input);
  const audioPrompt = input.audio?.required ? buildAudioPrompt(input.audio, input.domain) : undefined;
  const upscalePrompt = input.upscale?.required ? buildUpscalePrompt(input.upscale, input.domain) : undefined;

  const mainPrompt = compactText([
    `Professional ${input.domain.toLowerCase()} ${input.workflowType} generation.`,
    input.userBrief ? `Brief: ${input.userBrief}.` : '',
    selectionText ? `Selected controls: ${selectionText}.` : '',
    lockInstructions.join(' '),
    referenceInstructions.join(' '),
    storyPrompt ? `Clip storytelling: ${storyPrompt}.` : '',
    'Create a polished, professional, market-ready result with coherent composition and realistic detail.'
  ].join(' '));

  const negativePrompt = buildNegativePrompt(input);
  let enginePrompt = compactText(`${mainPrompt} Negative prompt: ${negativePrompt}`);
  const warnings: string[] = [];

  if (enginePrompt.length > MAX_PROMPT_CHARS) {
    warnings.push(`Prompt exceeds ${MAX_PROMPT_CHARS} characters. Apply compression before final engine submission.`);
    enginePrompt = enginePrompt.slice(0, MAX_PROMPT_CHARS - 40).trim() + '...';
  }

  return {
    mainPrompt,
    negativePrompt,
    enginePrompt,
    referenceInstructions,
    lockInstructions,
    storyPrompt,
    audioPrompt,
    upscalePrompt,
    qualityChecklist: qualityChecklist(input.domain),
    characterCount: enginePrompt.length,
    warnings
  };
}
