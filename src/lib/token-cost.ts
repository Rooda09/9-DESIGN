import type { JobType } from './types';

export interface TokenCostInput {
  jobType: JobType;
  engineBaseCost: number;
  qualityMultiplier?: number;
  durationSeconds?: number;
  upscaleMultiplier?: number;
  batchCount?: number;
}

export function estimateTokenCost(input: TokenCostInput): number {
  const quality = input.qualityMultiplier ?? 1;
  const batch = input.batchCount ?? 1;
  let cost = input.engineBaseCost * quality;

  if (input.jobType === 'CLIP_GENERATION') {
    cost *= Math.max(1, Math.ceil((input.durationSeconds ?? 8) / 8));
  }
  if (input.jobType === 'IMAGE_UPSCALE' || input.jobType === 'CLIP_UPSCALE') {
    cost *= input.upscaleMultiplier ?? 1.5;
  }
  if (input.jobType === 'AUDIO_GENERATION') {
    cost *= Math.max(1, Math.ceil((input.durationSeconds ?? 10) / 10));
  }

  return Math.ceil(cost * batch);
}
