import { describe, expect, it } from 'vitest';
import {
  ARCHITECTURE_AUDIO_MOOD_KEYS,
  ARCHITECTURE_SFX_DIRECTION_KEYS,
  ARCHITECTURE_UPSCALE_CONTROL_KEYS,
  ARCHITECTURE_UPSCALE_INTENT_KEYS,
  architectureAudioMoods,
  architectureSfxDirections,
  architectureUpscaleControls,
  architectureUpscaleIntents
} from '../src/config/architecture-upscale-audio';
import { compileArchitectureAudioPrompt } from '../src/lib/architecture/audio/compiler';
import type { ArchitectureAudioCompileInput } from '../src/lib/architecture/audio/types';
import { architectureAudioCompileSchema } from '../src/lib/architecture/audio/validation';
import { compileArchitectureUpscalePrompt } from '../src/lib/architecture/upscale/compiler';
import type { ArchitectureUpscaleCompileInput } from '../src/lib/architecture/upscale/types';
import { architectureUpscaleCompileSchema } from '../src/lib/architecture/upscale/validation';

const validUpscaleInput: ArchitectureUpscaleCompileInput = {
  intentKey: 'clean_ai_artifacts',
  sourceImageDescription: 'Approved exterior render of a contemporary villa with stone cladding, deep balconies, and evening lighting.',
  qualityControlKeys: [
    'geometry_preservation',
    'facade_detail_preservation',
    'material_fidelity',
    'no_new_unwanted_elements'
  ],
  outputUseNote: 'Prepare for a client presentation board.'
};

const validAudioInput: ArchitectureAudioCompileInput = {
  moodKey: 'luxury_calm',
  sfxKey: 'subtle_wind',
  durationSeconds: 10,
  sceneDescription: 'Slow exterior reveal of a premium coastal villa at blue hour with warm interior glow.',
  voiceoverPlaceholder: 'Optional 8-word intro naming the project and location.',
  loopSeamless: true
};

describe('Phase 4C Architecture upscale and audio seed data', () => {
  it('provides the requested Architecture upscale intents', () => {
    expect(architectureUpscaleIntents.map(intent => intent.key)).toEqual(ARCHITECTURE_UPSCALE_INTENT_KEYS);
    expect(ARCHITECTURE_UPSCALE_INTENT_KEYS).toEqual([
      'enhance_render_realism',
      'sharpen_facade_details',
      'improve_material_texture',
      'improve_lighting_and_shadows',
      'clean_ai_artifacts',
      'upscale_for_presentation_board',
      'upscale_for_social_media',
      'upscale_for_client_marketing'
    ]);
  });

  it('provides the requested Architecture image quality controls', () => {
    expect(architectureUpscaleControls.map(control => control.key)).toEqual(ARCHITECTURE_UPSCALE_CONTROL_KEYS);
    expect(ARCHITECTURE_UPSCALE_CONTROL_KEYS).toEqual([
      'geometry_preservation',
      'facade_detail_preservation',
      'material_fidelity',
      'edge_sharpness',
      'noise_artifact_reduction',
      'lighting_balance',
      'realistic_scale',
      'no_new_unwanted_elements'
    ]);
  });

  it('provides the requested Architecture audio moods and SFX directions', () => {
    expect(architectureAudioMoods.map(mood => mood.key)).toEqual(ARCHITECTURE_AUDIO_MOOD_KEYS);
    expect(architectureSfxDirections.map(direction => direction.key)).toEqual(ARCHITECTURE_SFX_DIRECTION_KEYS);
    expect(ARCHITECTURE_AUDIO_MOOD_KEYS).toEqual([
      'cinematic_ambient',
      'luxury_calm',
      'futuristic_minimal',
      'warm_residential',
      'urban_commercial',
      'desert_atmosphere',
      'night_architectural_reveal',
      'gallery_museum_calm'
    ]);
    expect(ARCHITECTURE_SFX_DIRECTION_KEYS).toEqual([
      'subtle_wind',
      'soft_footsteps',
      'city_ambience',
      'water_feature',
      'distant_traffic',
      'interior_room_tone',
      'soft_mechanical_hum',
      'no_sfx'
    ]);
  });
});

describe('Phase 4C Architecture upscale compiler', () => {
  it('builds a complete provider-free upscale prompt package', () => {
    const result = compileArchitectureUpscalePrompt(validUpscaleInput);

    expect(result.packageType).toBe('architecture_upscale_prompt');
    expect(result.upscaleObjective).toContain('Clean AI artifacts');
    expect(result.preservationInstructions.join(' ')).toContain('Preserve exact building massing');
    expect(result.preservationInstructions.join(' ')).toContain('Do not add new floors');
    expect(result.enhancementInstructions.join(' ')).toContain('Source image context');
    expect(result.negativeUpscalePrompt).toContain('extra floors');
    expect(result.negativeUpscalePrompt).toContain('new facade openings');
    expect(result.outputFormatNotes).toContain('do not call an upscale provider');
    expect(result.qualityChecklist.join(' ')).toContain('No new unwanted elements');
    expect(result.characterCount).toBeGreaterThan(100);
    expect(result.characterCount).toBeLessThanOrEqual(5000);
  });

  it('validates supported upscale requests and rejects duplicates or unsupported controls', () => {
    expect(architectureUpscaleCompileSchema.safeParse(validUpscaleInput).success).toBe(true);

    expect(architectureUpscaleCompileSchema.safeParse({
      ...validUpscaleInput,
      qualityControlKeys: ['geometry_preservation', 'geometry_preservation']
    }).success).toBe(false);

    expect(architectureUpscaleCompileSchema.safeParse({
      ...validUpscaleInput,
      intentKey: 'photography_retouch'
    }).success).toBe(false);
  });
});

describe('Phase 4C Architecture audio compiler', () => {
  it('builds a complete provider-free audio prompt package', () => {
    const result = compileArchitectureAudioPrompt(validAudioInput);

    expect(result.packageType).toBe('architecture_audio_prompt');
    expect(result.backgroundAudioPrompt).toContain('Architecture clip background audio prompt');
    expect(result.backgroundAudioPrompt).toContain('luxury calm');
    expect(result.sfxDirection).toContain('subtle wind');
    expect(result.voiceoverPlaceholder).toContain('Optional voiceover placeholder');
    expect(result.timingNotes).toContain('10 seconds');
    expect(result.loopSeamlessInstruction).toContain('loopable');
    expect(result.negativeAudioPrompt).toContain('lyrics');
    expect(result.negativeAudioPrompt).toContain('audio watermark');
    expect(result.characterCount).toBeGreaterThan(100);
    expect(result.characterCount).toBeLessThanOrEqual(5000);
  });

  it('validates supported audio requests and rejects non-Architecture audio contracts', () => {
    expect(architectureAudioCompileSchema.safeParse(validAudioInput).success).toBe(true);

    expect(architectureAudioCompileSchema.safeParse({
      ...validAudioInput,
      moodKey: 'podcast_intro'
    }).success).toBe(false);

    expect(architectureAudioCompileSchema.safeParse({
      ...validAudioInput,
      durationSeconds: 60
    }).success).toBe(false);

    expect(architectureAudioCompileSchema.safeParse({
      ...validAudioInput,
      sceneDescription: 'short'
    }).success).toBe(false);
  });
});
