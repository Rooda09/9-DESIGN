export type DomainKey = 'ARCHITECTURE' | 'PHOTOGRAPHY' | 'BRANDING';
export type EngineType = 'IMAGE' | 'CLIP' | 'AUDIO' | 'UPSCALE';
export type JobType = 'IMAGE_GENERATION' | 'CLIP_GENERATION' | 'AUDIO_GENERATION' | 'IMAGE_UPSCALE' | 'CLIP_UPSCALE';

export interface DropdownSelection {
  groupKey: string;
  value: string;
  label?: string;
  promptFragment?: string;
}

export interface ReferenceAssetInput {
  id: string;
  url: string;
  role:
    | 'GEOMETRY_REFERENCE'
    | 'STYLE_REFERENCE'
    | 'MATERIAL_REFERENCE'
    | 'LIGHTING_REFERENCE'
    | 'CAMERA_REFERENCE'
    | 'BRAND_REFERENCE'
    | 'PRODUCT_REFERENCE'
    | 'MOTION_REFERENCE';
  lockStrength?: 'LOW' | 'MEDIUM' | 'HIGH' | 'STRICT';
}

export interface PromptCompileInput {
  domain: DomainKey;
  workflowType: string;
  engineKey: string;
  userBrief?: string;
  selections: DropdownSelection[];
  references?: ReferenceAssetInput[];
  negativeConstraints?: string[];
  storytelling?: StorytellingInput;
  audio?: AudioInput;
  upscale?: UpscaleInput;
}

export interface StorytellingInput {
  storyArc?: string;
  sceneBeginning?: string;
  sceneMiddle?: string;
  sceneEnd?: string;
  cameraMotion?: string;
  durationSeconds?: number;
}

export interface AudioInput {
  required: boolean;
  mood?: string;
  genre?: string;
  tempo?: string;
  ambience?: string;
  sfxDirection?: string;
  voiceoverUse?: string;
}

export interface UpscaleInput {
  required: boolean;
  mode?: string;
  targetResolution?: string;
  preserveRealism?: boolean;
}

export interface PromptPackage {
  mainPrompt: string;
  negativePrompt: string;
  enginePrompt: string;
  referenceInstructions: string[];
  lockInstructions: string[];
  storyPrompt?: string;
  audioPrompt?: string;
  upscalePrompt?: string;
  qualityChecklist: string[];
  characterCount: number;
  warnings: string[];
}
