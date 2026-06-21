import type {
  ArchitectureUpscaleControlKey,
  ArchitectureUpscaleIntentKey
} from '../../../config/architecture-upscale-audio';

export interface ArchitectureUpscaleCompileInput {
  intentKey: ArchitectureUpscaleIntentKey;
  sourceImageDescription: string;
  qualityControlKeys: ArchitectureUpscaleControlKey[];
  outputUseNote?: string;
}

export interface ArchitectureUpscalePromptPackage {
  packageType: 'architecture_upscale_prompt';
  intentKey: ArchitectureUpscaleIntentKey;
  intentLabel: string;
  upscaleObjective: string;
  preservationInstructions: string[];
  enhancementInstructions: string[];
  negativeUpscalePrompt: string;
  outputFormatNotes: string;
  qualityChecklist: string[];
  characterCount: number;
  warnings: string[];
}
