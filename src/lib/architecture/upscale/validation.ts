import { z } from 'zod';
import {
  ARCHITECTURE_UPSCALE_CONTROL_KEYS,
  ARCHITECTURE_UPSCALE_INTENT_KEYS
} from '../../../config/architecture-upscale-audio';

export const architectureUpscaleCompileSchema = z.object({
  intentKey: z.enum(ARCHITECTURE_UPSCALE_INTENT_KEYS),
  sourceImageDescription: z.string().trim().min(12).max(1000),
  qualityControlKeys: z.array(z.enum(ARCHITECTURE_UPSCALE_CONTROL_KEYS))
    .min(1)
    .max(ARCHITECTURE_UPSCALE_CONTROL_KEYS.length),
  outputUseNote: z.string().trim().max(500).optional()
}).refine(
  value => new Set(value.qualityControlKeys).size === value.qualityControlKeys.length,
  { path: ['qualityControlKeys'], message: 'Quality controls must be unique.' }
);

export const architectureUpscalePackageSchema = z.object({
  packageType: z.literal('architecture_upscale_prompt'),
  intentKey: z.enum(ARCHITECTURE_UPSCALE_INTENT_KEYS),
  intentLabel: z.string().min(1).max(120),
  upscaleObjective: z.string().min(1).max(1000),
  preservationInstructions: z.array(z.string().min(1).max(1000)).min(1).max(12),
  enhancementInstructions: z.array(z.string().min(1).max(1000)).min(1).max(8),
  negativeUpscalePrompt: z.string().min(1).max(2000),
  outputFormatNotes: z.string().min(1).max(1000),
  qualityChecklist: z.array(z.string().min(1).max(500)).min(1).max(16),
  characterCount: z.number().int().nonnegative().max(5000),
  warnings: z.array(z.string().max(500)).max(5)
});

export const saveArchitectureUpscaleSchema = z.object({
  title: z.string().trim().min(2).max(120),
  upscalePackage: architectureUpscalePackageSchema
});
