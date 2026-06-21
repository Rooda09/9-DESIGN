import {
  getArchitectureUpscaleControl,
  getArchitectureUpscaleIntent,
  type ArchitectureUpscaleControl
} from '../../../config/architecture-upscale-audio';
import type {
  ArchitectureUpscaleCompileInput,
  ArchitectureUpscalePromptPackage
} from './types';

const MAX_PACKAGE_TEXT_CHARACTERS = 3000;

function compactText(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\s*;\s*/g, '; ').trim();
}

function totalCharacterCount(values: Array<string | string[]>) {
  return values.flat().join(' ').length;
}

export function compileArchitectureUpscalePrompt(
  input: ArchitectureUpscaleCompileInput
): ArchitectureUpscalePromptPackage {
  const intent = getArchitectureUpscaleIntent(input.intentKey);
  const controls = input.qualityControlKeys
    .map(getArchitectureUpscaleControl)
    .filter((control): control is ArchitectureUpscaleControl => Boolean(control));
  if (!intent || controls.length === 0) {
    throw new Error('Unsupported Architecture upscale configuration.');
  }

  const preservationInstructions = controls.map(control => control.preservationInstruction);
  const enhancementInstructions = [
    intent.enhancementInstruction,
    `Source image context: ${compactText(input.sourceImageDescription)}`,
    'Enhance only image quality, clarity, realism, and presentation polish; do not redesign the architecture.'
  ];
  const negativeUpscalePrompt = compactText([
    'changed building massing',
    'extra floors',
    'new facade openings',
    'moved windows or doors',
    'altered roofline',
    'warped perspective',
    'fake structure',
    'plastic material texture',
    'over-sharpened halos',
    'jagged edges',
    'texture noise',
    'AI smearing',
    'fake text',
    'watermark',
    'new people, vehicles, furniture, signs, plants, or objects unless explicitly requested'
  ].join(', '));
  const outputFormatNotes = compactText([
    intent.outputFormatNote,
    input.outputUseNote ? `Specific output use: ${input.outputUseNote}` : '',
    'Planning prompt only: do not call an upscale provider, create a generation job, or debit tokens.'
  ].filter(Boolean).join(' '));
  const qualityChecklist = [
    ...controls.map(control => control.checklistItem),
    'Image quality is improved without changing the approved architecture',
    'No new unwanted elements, text, logos, floors, openings, or structure are introduced',
    'Output remains a visualization artifact and not a construction, legal, or code-compliance document'
  ];
  const characterCount = totalCharacterCount([
    intent.objective,
    preservationInstructions,
    enhancementInstructions,
    negativeUpscalePrompt,
    outputFormatNotes,
    qualityChecklist
  ]);

  return {
    packageType: 'architecture_upscale_prompt',
    intentKey: intent.key,
    intentLabel: intent.labelEn,
    upscaleObjective: intent.objective,
    preservationInstructions,
    enhancementInstructions,
    negativeUpscalePrompt,
    outputFormatNotes,
    qualityChecklist,
    characterCount,
    warnings: characterCount > MAX_PACKAGE_TEXT_CHARACTERS
      ? ['Upscale package is verbose. Review and shorten optional output notes before provider use.']
      : []
  };
}
