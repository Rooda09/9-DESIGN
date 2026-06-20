import { z } from 'zod';
import {
  ARCHITECTURE_CAMERA_MOVEMENT_KEYS,
  ARCHITECTURE_CLIP_DURATIONS,
  ARCHITECTURE_CLIP_ENGINE_KEYS,
  ARCHITECTURE_CONTINUITY_KEYS
} from '../../../config/architecture-clips';

const storyField = z.string().trim().min(8).max(500);

export const architectureClipCompileSchema = z.object({
  scenarioKey: z.string().trim().min(1).max(120),
  scenarioTitle: z.string().trim().min(2).max(120),
  scenarioPrompt: z.string().trim().min(12).max(1000),
  engineKey: z.enum(ARCHITECTURE_CLIP_ENGINE_KEYS),
  durationSeconds: z.union(
    ARCHITECTURE_CLIP_DURATIONS.map(duration => z.literal(duration)) as [
      z.ZodLiteral<5>,
      z.ZodLiteral<8>,
      z.ZodLiteral<10>,
      z.ZodLiteral<15>,
      z.ZodLiteral<20>
    ]
  ),
  story: z.object({
    openingShot: storyField,
    subjectFocus: storyField,
    cameraMovement: z.enum(ARCHITECTURE_CAMERA_MOVEMENT_KEYS),
    atmosphere: storyField,
    architecturalDetail: storyField,
    closingShot: storyField
  }),
  continuity: z.object(
    Object.fromEntries(ARCHITECTURE_CONTINUITY_KEYS.map(key => [key, z.boolean()])) as {
      preserveBuildingGeometry: z.ZodBoolean;
      preserveFacadeOpenings: z.ZodBoolean;
      preserveMaterialPalette: z.ZodBoolean;
      preserveLightingMood: z.ZodBoolean;
      preserveCameraDirection: z.ZodBoolean;
    }
  )
});

export const architectureClipPackageSchema = z.object({
  scenarioTitle: z.string().min(1).max(120),
  scenarioKey: z.string().min(1).max(120),
  engineKey: z.enum(ARCHITECTURE_CLIP_ENGINE_KEYS),
  durationSeconds: z.number().int().positive().max(20),
  storytellingPrompt: z.string().min(1).max(4000),
  shotList: z.array(z.string().min(1).max(1000)).length(6),
  cameraMovementPrompt: z.string().min(1).max(1000),
  continuityInstructions: z.array(z.string().min(1).max(1000)).min(1).max(8),
  negativeVideoPrompt: z.string().min(1).max(2000),
  engineVideoPrompt: z.string().min(1).max(2000),
  qualityChecklist: z.array(z.string().min(1).max(500)).min(1).max(20),
  characterCount: z.number().int().nonnegative().max(2000),
  warnings: z.array(z.string().max(500)).max(5)
});

export const saveArchitectureScenarioSchema = z.object({
  title: z.string().trim().min(2).max(120),
  sourceScenarioId: z.string().trim().min(1).max(120).optional(),
  scenarioPackage: architectureClipPackageSchema
});
