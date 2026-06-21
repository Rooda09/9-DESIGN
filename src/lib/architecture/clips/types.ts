import type {
  ArchitectureCameraMovementKey,
  ArchitectureClipDuration,
  ArchitectureClipEngineKey,
  ArchitectureContinuityState
} from '../../../config/architecture-clips';

export interface ArchitectureClipStory {
  openingShot: string;
  subjectFocus: string;
  cameraMovement: ArchitectureCameraMovementKey;
  atmosphere: string;
  architecturalDetail: string;
  closingShot: string;
}

export interface ArchitectureClipCompileInput {
  scenarioKey: string;
  scenarioTitle: string;
  scenarioPrompt: string;
  engineKey: ArchitectureClipEngineKey;
  durationSeconds: ArchitectureClipDuration;
  story: ArchitectureClipStory;
  continuity: ArchitectureContinuityState;
}

export interface ArchitectureClipScenarioPackage {
  scenarioTitle: string;
  scenarioKey: string;
  engineKey: ArchitectureClipEngineKey;
  durationSeconds: ArchitectureClipDuration;
  storytellingPrompt: string;
  shotList: string[];
  cameraMovementPrompt: string;
  continuityInstructions: string[];
  negativeVideoPrompt: string;
  engineVideoPrompt: string;
  qualityChecklist: string[];
  characterCount: number;
  warnings: string[];
}
