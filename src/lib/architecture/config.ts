import type { GeometryGuardMode, ReferenceAssetInput } from '../types';

export const ARCHITECTURE_IMAGE_ENGINES = [
  {
    key: 'midjourney',
    name: 'Midjourney',
    guidance: 'Use compact visual clauses, architectural photography language, and Midjourney parameters only at the end.'
  },
  {
    key: 'gpt_image',
    name: 'DALL-E / GPT Image',
    guidance: 'Use clear natural-language instructions with explicit preservation and edit boundaries.'
  },
  {
    key: 'flux',
    name: 'Flux',
    guidance: 'Use concise subject, material, light, camera, and realism clauses with strong reference fidelity.'
  },
  {
    key: 'stable_diffusion',
    name: 'Stable Diffusion',
    guidance: 'Use ordered positive tags, explicit geometry constraints, and a separate negative prompt.'
  },
  {
    key: 'leonardo',
    name: 'Leonardo',
    guidance: 'Use production-ready architectural visualization language with material and lighting specificity.'
  },
  {
    key: 'runway',
    name: 'Runway',
    guidance: 'Use direct scene instructions with composition, camera, reference fidelity, and restrained motion language.'
  },
  {
    key: 'kling',
    name: 'Kling',
    guidance: 'Use spatially explicit scene language, stable geometry, camera continuity, and realistic environmental detail.'
  },
  {
    key: 'pika',
    name: 'Pika',
    guidance: 'Use short visual instructions prioritizing stable architecture, framing, atmosphere, and reference consistency.'
  },
  {
    key: 'luma',
    name: 'Luma',
    guidance: 'Use cinematic but controlled scene language with spatial consistency and physically plausible light.'
  }
] as const;

export const ARCHITECTURE_ENGINE_KEYS = [
  'midjourney',
  'gpt_image',
  'flux',
  'stable_diffusion',
  'leonardo',
  'runway',
  'kling',
  'pika',
  'luma'
] as const;

export type ArchitectureEngineKey = (typeof ARCHITECTURE_ENGINE_KEYS)[number];

export const GEOMETRY_GUARD_OPTIONS: Array<{
  value: GeometryGuardMode;
  label: string;
  bestFor: string;
  description: string;
}> = [
  {
    value: 'FIXED_GEOMETRY',
    label: 'Fixed Geometry',
    bestFor: 'Client revisions and reference-based visualization',
    description: 'Strictly preserves massing, boundaries, floor count, roofline, openings, proportions, and camera position.'
  },
  {
    value: 'SEMI_FIXED_GEOMETRY',
    label: 'Semi-Fixed Geometry',
    bestFor: 'Controlled facade, material, and atmosphere studies',
    description: 'Preserves primary massing and site logic while allowing approved surface-level design development.'
  },
  {
    value: 'FREE_CONCEPT',
    label: 'Free Concept',
    bestFor: 'Early concept exploration',
    description: 'Uses references as inspiration and permits major architectural transformation while retaining the brief.'
  },
  {
    value: 'FACADE_ONLY',
    label: 'Facade Only',
    bestFor: 'Facade redesign without changing the building',
    description: 'Locks structure, massing, openings, roofline, site, and camera; changes only facade composition and treatment.'
  },
  {
    value: 'MATERIAL_ONLY',
    label: 'Material Only',
    bestFor: 'Material alternatives and client comparisons',
    description: 'Locks all geometry and composition; changes only finish materials, colors, textures, and reflectance.'
  },
  {
    value: 'INTERIOR_FINISH_ONLY',
    label: 'Interior Finish Only',
    bestFor: 'Interior finish and furnishing studies',
    description: 'Locks room geometry, openings, ceiling, camera, and circulation; changes only finishes, fixtures, and furnishings.'
  },
  {
    value: 'LANDSCAPE_ONLY',
    label: 'Landscape Only',
    bestFor: 'Site and garden development around fixed architecture',
    description: 'Locks the building and plot boundary; changes only planting, hardscape, site furniture, and landscape lighting.'
  }
];

export type ArchitectureReferenceRole = Extract<
  ReferenceAssetInput['role'],
  | 'GEOMETRY_REFERENCE'
  | 'STYLE_REFERENCE'
  | 'MATERIAL_REFERENCE'
  | 'LIGHTING_REFERENCE'
  | 'CAMERA_REFERENCE'
  | 'MOOD_REFERENCE'
>;

export const ARCHITECTURE_REFERENCE_ROLES: Array<{
  value: ArchitectureReferenceRole;
  label: string;
  description: string;
}> = [
  {
    value: 'GEOMETRY_REFERENCE',
    label: 'Geometry reference',
    description: 'Controls massing, boundaries, openings, proportions, floor count, and camera relationship.'
  },
  {
    value: 'STYLE_REFERENCE',
    label: 'Style reference',
    description: 'Guides architectural language without overriding locked geometry.'
  },
  {
    value: 'MATERIAL_REFERENCE',
    label: 'Material reference',
    description: 'Guides material palette, texture scale, joints, finish, and reflectance.'
  },
  {
    value: 'LIGHTING_REFERENCE',
    label: 'Lighting reference',
    description: 'Guides time of day, contrast, color temperature, shadow direction, and exposure.'
  },
  {
    value: 'CAMERA_REFERENCE',
    label: 'Camera reference',
    description: 'Guides viewpoint, lens character, framing, crop, and perspective.'
  },
  {
    value: 'MOOD_REFERENCE',
    label: 'Mood reference',
    description: 'Guides atmosphere, visual tone, weather, occupancy, and emotional character.'
  }
];

export function isArchitectureEngineKey(value: string): value is ArchitectureEngineKey {
  return ARCHITECTURE_ENGINE_KEYS.includes(value as ArchitectureEngineKey);
}

export function getGeometryGuardOption(mode: GeometryGuardMode | undefined) {
  return GEOMETRY_GUARD_OPTIONS.find(option => option.value === mode);
}

export function getArchitectureEngine(key: string) {
  return ARCHITECTURE_IMAGE_ENGINES.find(engine => engine.key === key);
}
