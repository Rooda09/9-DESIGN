import { z } from 'zod';
import {
  ARCHITECTURE_AUDIO_DURATIONS,
  ARCHITECTURE_AUDIO_MOOD_KEYS,
  ARCHITECTURE_SFX_DIRECTION_KEYS
} from '../../../config/architecture-upscale-audio';

export const architectureAudioCompileSchema = z.object({
  moodKey: z.enum(ARCHITECTURE_AUDIO_MOOD_KEYS),
  sfxKey: z.enum(ARCHITECTURE_SFX_DIRECTION_KEYS),
  durationSeconds: z.union(
    ARCHITECTURE_AUDIO_DURATIONS.map(duration => z.literal(duration)) as [
      z.ZodLiteral<5>,
      z.ZodLiteral<8>,
      z.ZodLiteral<10>,
      z.ZodLiteral<15>,
      z.ZodLiteral<20>
    ]
  ),
  sceneDescription: z.string().trim().min(12).max(1000),
  voiceoverPlaceholder: z.string().trim().max(500).optional(),
  loopSeamless: z.boolean()
});

export const architectureAudioPackageSchema = z.object({
  packageType: z.literal('architecture_audio_prompt'),
  moodKey: z.enum(ARCHITECTURE_AUDIO_MOOD_KEYS),
  moodLabel: z.string().min(1).max(120),
  sfxKey: z.enum(ARCHITECTURE_SFX_DIRECTION_KEYS),
  durationSeconds: z.number().int().positive().max(20),
  backgroundAudioPrompt: z.string().min(1).max(2000),
  sfxDirection: z.string().min(1).max(1000),
  voiceoverPlaceholder: z.string().min(1).max(1000),
  timingNotes: z.string().min(1).max(1000),
  loopSeamlessInstruction: z.string().min(1).max(1000),
  negativeAudioPrompt: z.string().min(1).max(2000),
  characterCount: z.number().int().nonnegative().max(5000),
  warnings: z.array(z.string().max(500)).max(5)
});

export const saveArchitectureAudioSchema = z.object({
  title: z.string().trim().min(2).max(120),
  audioPackage: architectureAudioPackageSchema
});
