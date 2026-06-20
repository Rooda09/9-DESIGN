import type { DomainKey, JobType } from './types';

export interface EngineCandidate {
  key: string;
  type: 'IMAGE' | 'CLIP' | 'AUDIO' | 'UPSCALE';
  supportsReferenceLock?: boolean;
  supportsImageToVideo?: boolean;
  supportsAudio?: boolean;
  supportsUpscale?: boolean;
  qualityScore: number;
  costScore: number;
  speedScore: number;
  active: boolean;
}

export interface EngineRouteInput {
  domain: DomainKey;
  jobType: JobType;
  needsReferenceLock?: boolean;
  qualityTarget?: 'DRAFT' | 'STANDARD' | 'FINAL';
  costPriority?: 'LOW_COST' | 'BALANCED' | 'QUALITY_FIRST';
  candidates: EngineCandidate[];
}

export function recommendEngine(input: EngineRouteInput): EngineCandidate | null {
  const requiredType = input.jobType.includes('CLIP') ? 'CLIP'
    : input.jobType.includes('AUDIO') ? 'AUDIO'
    : input.jobType.includes('UPSCALE') ? 'UPSCALE'
    : 'IMAGE';

  const candidates = input.candidates.filter(e => e.active && e.type === requiredType);
  if (!candidates.length) return null;

  const scored = candidates.map(engine => {
    let score = 0;
    score += engine.qualityScore * (input.costPriority === 'QUALITY_FIRST' ? 2 : 1);
    score += engine.costScore * (input.costPriority === 'LOW_COST' ? 2 : 1);
    score += engine.speedScore * (input.qualityTarget === 'DRAFT' ? 1.5 : 1);
    if (input.needsReferenceLock && engine.supportsReferenceLock) score += 25;
    if (input.needsReferenceLock && !engine.supportsReferenceLock) score -= 50;
    return { engine, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.engine ?? null;
}
