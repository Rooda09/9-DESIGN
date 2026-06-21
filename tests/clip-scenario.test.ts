import { describe, expect, it } from 'vitest';
import {
  ARCHITECTURE_CAMERA_MOVEMENT_KEYS,
  ARCHITECTURE_CLIP_DURATIONS,
  ARCHITECTURE_CLIP_ENGINE_KEYS,
  ARCHITECTURE_CONTINUITY_KEYS,
  architectureClipScenarios
} from '../src/config/architecture-clips';
import { compileArchitectureClipScenario } from '../src/lib/architecture/clips/compiler';
import { architectureClipCompileSchema } from '../src/lib/architecture/clips/validation';

const exteriorReveal = architectureClipScenarios[0];
const validInput = {
  scenarioKey: exteriorReveal.key,
  scenarioTitle: exteriorReveal.titleEn,
  scenarioPrompt: exteriorReveal.scenarioPrompt,
  engineKey: 'kling' as const,
  durationSeconds: 8 as const,
  story: {
    openingShot: exteriorReveal.openingShot,
    subjectFocus: exteriorReveal.subjectFocus,
    cameraMovement: exteriorReveal.cameraMovement,
    atmosphere: exteriorReveal.atmosphere,
    architecturalDetail: exteriorReveal.architecturalDetail,
    closingShot: exteriorReveal.closingShot
  },
  continuity: exteriorReveal.continuityDefaults
};

describe('Architecture clip scenario seed data', () => {
  it('provides the ten requested Architecture scenario types', () => {
    expect(architectureClipScenarios.map(scenario => scenario.category)).toEqual([
      'exterior_reveal',
      'facade_orbit',
      'slow_dolly_in',
      'interior_walkthrough',
      'landscape_flythrough',
      'material_close_up',
      'day_to_night_transition',
      'before_after_renovation',
      'aerial_site_reveal',
      'cinematic_real_estate_teaser'
    ]);
  });

  it('provides complete story, continuity, and engine guidance for every scenario', () => {
    for (const scenario of architectureClipScenarios) {
      expect(scenario.openingShot.length).toBeGreaterThan(10);
      expect(scenario.subjectFocus.length).toBeGreaterThan(10);
      expect(scenario.atmosphere.length).toBeGreaterThan(10);
      expect(scenario.architecturalDetail.length).toBeGreaterThan(10);
      expect(scenario.closingShot.length).toBeGreaterThan(10);
      expect(ARCHITECTURE_CAMERA_MOVEMENT_KEYS).toContain(scenario.cameraMovement);
      expect(ARCHITECTURE_CLIP_DURATIONS).toContain(scenario.durationSeconds);
      for (const key of ARCHITECTURE_CONTINUITY_KEYS) {
        expect(typeof scenario.continuityDefaults[key]).toBe('boolean');
      }
      for (const engineKey of ARCHITECTURE_CLIP_ENGINE_KEYS) {
        expect(scenario.engineHints[engineKey].length).toBeGreaterThan(5);
      }
    }
  });
});

describe('Architecture clip compiler', () => {
  it.each(ARCHITECTURE_CLIP_ENGINE_KEYS)('compiles a complete %s package under 2000 characters', engineKey => {
    const result = compileArchitectureClipScenario({ ...validInput, engineKey });

    expect(result.shotList).toHaveLength(6);
    expect(result.engineVideoPrompt.length).toBeLessThanOrEqual(2000);
    expect(result.negativeVideoPrompt).toContain('geometry morphing');
    expect(result.continuityInstructions.join(' ')).toContain('building massing');
    expect(result.qualityChecklist.join(' ')).toContain('No geometry drift');
  });

  it('adapts negative constraints when a transition unlocks lighting or materials', () => {
    const result = compileArchitectureClipScenario({
      ...validInput,
      continuity: {
        ...validInput.continuity,
        preserveLightingMood: false,
        preserveMaterialPalette: false
      }
    });

    expect(result.negativeVideoPrompt).toContain('abrupt exposure jumps');
    expect(result.negativeVideoPrompt).toContain('unapproved material changes');
  });
});

describe('Architecture clip request validation', () => {
  it('accepts the supported scenario contract', () => {
    expect(architectureClipCompileSchema.safeParse(validInput).success).toBe(true);
  });

  it('rejects unsupported engines, durations, and incomplete story fields', () => {
    const result = architectureClipCompileSchema.safeParse({
      ...validInput,
      engineKey: 'unsupported',
      durationSeconds: 12,
      story: { ...validInput.story, openingShot: 'short' }
    });

    expect(result.success).toBe(false);
  });
});
