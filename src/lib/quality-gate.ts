import type { DomainKey, PromptPackage } from './types';

export interface QualityGateResult {
  score: number;
  blockingIssues: string[];
  warnings: string[];
  suggestedActions: string[];
}

export function evaluatePromptPackage(domain: DomainKey, pkg: PromptPackage): QualityGateResult {
  const blockingIssues: string[] = [];
  const warnings: string[] = [...pkg.warnings];
  const suggestedActions: string[] = [];

  if (!pkg.mainPrompt || pkg.mainPrompt.length < 80) {
    blockingIssues.push('Prompt is too weak for professional generation.');
    suggestedActions.push('Add project purpose, style, material, camera, lighting, and output intent.');
  }

  if (pkg.characterCount > 2000) {
    warnings.push('Prompt may exceed recommended engine length.');
    suggestedActions.push('Compress repeated adjectives and keep lock instructions.');
  }

  if (domain === 'ARCHITECTURE' && !pkg.lockInstructions.join(' ').toLowerCase().includes('geometry')) {
    warnings.push('Architecture prompt does not strongly protect geometry.');
    suggestedActions.push('Enable Geometry Guard.');
  }

  if (domain === 'PHOTOGRAPHY' && !pkg.negativePrompt.toLowerCase().includes('deformed product')) {
    warnings.push('Photography prompt may not sufficiently protect product shape.');
    suggestedActions.push('Enable Product Lock.');
  }

  if (domain === 'BRANDING' && !pkg.negativePrompt.toLowerCase().includes('off-brand')) {
    warnings.push('Branding prompt may not sufficiently protect brand consistency.');
    suggestedActions.push('Enable Brand Memory.');
  }

  const penalty = blockingIssues.length * 30 + warnings.length * 8;
  return {
    score: Math.max(0, 100 - penalty),
    blockingIssues,
    warnings,
    suggestedActions
  };
}
