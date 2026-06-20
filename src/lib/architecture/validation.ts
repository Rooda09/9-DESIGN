import { z } from 'zod';
import { ARCHITECTURE_ENGINE_KEYS } from './config';

export const geometryGuardSchema = z.enum([
  'FIXED_GEOMETRY',
  'SEMI_FIXED_GEOMETRY',
  'FREE_CONCEPT',
  'FACADE_ONLY',
  'MATERIAL_ONLY',
  'INTERIOR_FINISH_ONLY',
  'LANDSCAPE_ONLY'
]);

export const architectureReferenceRoleSchema = z.enum([
  'GEOMETRY_REFERENCE',
  'STYLE_REFERENCE',
  'MATERIAL_REFERENCE',
  'LIGHTING_REFERENCE',
  'CAMERA_REFERENCE',
  'MOOD_REFERENCE'
]);

export const architectureCompileSchema = z.object({
  domain: z.literal('ARCHITECTURE'),
  templateId: z.string().min(1),
  workflowType: z.string().min(1).max(120),
  engineKey: z.enum(ARCHITECTURE_ENGINE_KEYS),
  geometryGuard: geometryGuardSchema,
  userBrief: z.string().trim().min(12).max(1600),
  selections: z.array(z.object({
    optionId: z.string().min(1),
    groupKey: z.string().min(1),
    value: z.string().min(1)
  })).max(50).default([]),
  references: z.array(z.object({
    id: z.string().min(1),
    url: z.string().url(),
    role: architectureReferenceRoleSchema,
    lockStrength: z.enum(['LOW', 'MEDIUM', 'HIGH', 'STRICT']).default('HIGH')
  })).max(6).default([]),
  negativeConstraints: z.array(z.string().trim().min(1).max(240)).max(12).default([])
});

export const saveArchitecturePromptSchema = z.object({
  title: z.string().trim().min(2).max(120),
  templateId: z.string().min(1),
  promptPackage: z.object({
    mainPrompt: z.string().min(1).max(4000),
    negativePrompt: z.string().min(1).max(2000),
    enginePrompt: z.string().min(1).max(2000),
    referenceInstructions: z.array(z.string()),
    geometryInstructions: z.array(z.string()),
    lockInstructions: z.array(z.string()),
    qualityChecklist: z.array(z.string()),
    characterCount: z.number().int().nonnegative(),
    warnings: z.array(z.string()),
    storyPrompt: z.string().optional(),
    audioPrompt: z.string().optional(),
    upscalePrompt: z.string().optional()
  })
});

export type ArchitectureCompileRequest = z.infer<typeof architectureCompileSchema>;
