import type { DomainKey, UpscaleInput } from './types';

export function buildUpscalePrompt(upscale: UpscaleInput, domain: DomainKey): string {
  const baseByDomain: Record<DomainKey, string> = {
    ARCHITECTURE: 'Enhance architectural edges, material detail, facade clarity, realistic shadows, and presentation sharpness while preserving geometry.',
    PHOTOGRAPHY: 'Enhance product sharpness, texture, label clarity, lighting realism, and commercial polish without deforming the product.',
    BRANDING: 'Enhance campaign clarity, graphic edges, color consistency, typography-like details, and premium finish without altering brand identity.'
  };

  return [
    baseByDomain[domain],
    upscale.mode ? `Mode: ${upscale.mode}.` : '',
    upscale.targetResolution ? `Target resolution: ${upscale.targetResolution}.` : '',
    upscale.preserveRealism ? 'Preserve realism and avoid over-sharpened AI artifacts.' : ''
  ].filter(Boolean).join(' ');
}
