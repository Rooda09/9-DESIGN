import {
  getArchitectureAudioMood,
  getArchitectureSfxDirection
} from '../../../config/architecture-upscale-audio';
import type {
  ArchitectureAudioCompileInput,
  ArchitectureAudioPromptPackage
} from './types';

const MAX_AUDIO_PROMPT_CHARACTERS = 2000;

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

export function compileArchitectureAudioPrompt(
  input: ArchitectureAudioCompileInput
): ArchitectureAudioPromptPackage {
  const mood = getArchitectureAudioMood(input.moodKey);
  const sfx = getArchitectureSfxDirection(input.sfxKey);
  if (!mood || !sfx) {
    throw new Error('Unsupported Architecture audio configuration.');
  }

  const backgroundAudio = compactToLimit([
    'Architecture clip background audio prompt.',
    mood.promptFragment,
    `Scene context: ${input.sceneDescription}`,
    `Duration target: ${input.durationSeconds} seconds.`,
    'Support the spatial story and architectural atmosphere without overpowering camera movement or visual detail.'
  ].join(' '), MAX_AUDIO_PROMPT_CHARACTERS);
  const voiceoverPlaceholder = compactText(
    input.voiceoverPlaceholder?.trim()
      ? `Optional voiceover placeholder: ${input.voiceoverPlaceholder}`
      : 'Voiceover placeholder only: no final narration text is required in Phase 4C.'
  );
  const timingNotes = compactText(
    `Build a gentle intro in the first second, keep the main bed stable through the architectural reveal, and resolve cleanly by ${input.durationSeconds} seconds.`
  );
  const loopSeamlessInstruction = input.loopSeamless
    ? 'Make the background bed loopable with a seamless tail, no hard ending, no reverb chop, and no abrupt reset.'
    : 'Create a clean beginning and ending for a single clip export; looping is not required.';
  const negativeAudioPrompt = compactText([
    'loud melody',
    'aggressive beat',
    'busy percussion',
    'distracting vocals',
    'lyrics',
    'harsh risers',
    'sudden impact hits',
    'distorted bass',
    'clipping',
    'noise bursts',
    'cartoon sound effects',
    'overly dramatic trailer sound',
    'audio watermark',
    'brand jingle'
  ].join(', '));
  const characterCount = [
    backgroundAudio.text,
    sfx.promptFragment,
    voiceoverPlaceholder,
    timingNotes,
    loopSeamlessInstruction,
    negativeAudioPrompt
  ].join(' ').length;

  return {
    packageType: 'architecture_audio_prompt',
    moodKey: mood.key,
    moodLabel: mood.labelEn,
    sfxKey: sfx.key,
    durationSeconds: input.durationSeconds,
    backgroundAudioPrompt: backgroundAudio.text,
    sfxDirection: sfx.promptFragment,
    voiceoverPlaceholder,
    timingNotes,
    loopSeamlessInstruction,
    negativeAudioPrompt,
    characterCount,
    warnings: backgroundAudio.truncated
      ? ['Background audio prompt was compacted to the 2,000-character limit.']
      : []
  };
}
