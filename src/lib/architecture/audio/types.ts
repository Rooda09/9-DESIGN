import type {
  ArchitectureAudioDuration,
  ArchitectureAudioMoodKey,
  ArchitectureSfxDirectionKey
} from '../../../config/architecture-upscale-audio';

export interface ArchitectureAudioCompileInput {
  moodKey: ArchitectureAudioMoodKey;
  sfxKey: ArchitectureSfxDirectionKey;
  durationSeconds: ArchitectureAudioDuration;
  sceneDescription: string;
  voiceoverPlaceholder?: string;
  loopSeamless: boolean;
}

export interface ArchitectureAudioPromptPackage {
  packageType: 'architecture_audio_prompt';
  moodKey: ArchitectureAudioMoodKey;
  moodLabel: string;
  sfxKey: ArchitectureSfxDirectionKey;
  durationSeconds: ArchitectureAudioDuration;
  backgroundAudioPrompt: string;
  sfxDirection: string;
  voiceoverPlaceholder: string;
  timingNotes: string;
  loopSeamlessInstruction: string;
  negativeAudioPrompt: string;
  characterCount: number;
  warnings: string[];
}
