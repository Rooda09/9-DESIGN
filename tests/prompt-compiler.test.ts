import { describe, expect, it } from 'vitest';
import {
  ARCHITECTURE_IMAGE_ENGINES,
  GEOMETRY_GUARD_OPTIONS
} from '../src/lib/architecture/config';
import { architectureCompileSchema } from '../src/lib/architecture/validation';
import { compilePrompt } from '../src/lib/prompt-compiler';

const baseInput = {
  domain: 'ARCHITECTURE' as const,
  templateId: 'template_1',
  templateTitle: 'Exterior renewal',
  templateDescription: 'Controlled facade and material development',
  workflowType: 'exterior_render',
  engineKey: 'midjourney',
  geometryGuard: 'FIXED_GEOMETRY' as const,
  userBrief: 'Luxury coastal villa exterior from an approved reference model',
  selections: [
    { groupKey: 'architectural_style', value: 'contemporary_luxury', label: 'Contemporary Luxury' },
    { groupKey: 'lighting_time', value: 'blue_hour', label: 'Blue Hour' }
  ],
  references: [
    { id: 'geometry_reference', url: 'https://example.com/a.png', role: 'GEOMETRY_REFERENCE' as const, lockStrength: 'STRICT' as const }
  ]
};

describe('Architecture prompt compiler', () => {
  it('creates a fixed-geometry prompt package under 2000 characters', () => {
    const pkg = compilePrompt(baseInput);

    expect(pkg.enginePrompt.length).toBeLessThanOrEqual(2000);
    expect(pkg.geometryInstructions.join(' ')).toContain('Fixed Geometry');
    expect(pkg.geometryInstructions.join(' ')).toContain('plot boundary');
    expect(pkg.referenceInstructions.join(' ')).toContain('Geometry reference');
    expect(pkg.qualityChecklist).toContain('Geometry Guard scope followed');
  });

  it.each(GEOMETRY_GUARD_OPTIONS)(
    'compiles explicit instructions for $label',
    option => {
      const pkg = compilePrompt({
        ...baseInput,
        geometryGuard: option.value
      });

      expect(pkg.geometryInstructions.join(' ')).toContain(option.label);
      expect(pkg.enginePrompt.length).toBeLessThanOrEqual(2000);
    }
  );

  it.each(ARCHITECTURE_IMAGE_ENGINES)(
    'supports the $name engine prompt format',
    engine => {
      const pkg = compilePrompt({
        ...baseInput,
        engineKey: engine.key
      });

      expect(pkg.enginePrompt.length).toBeLessThanOrEqual(2000);
      expect(pkg.enginePrompt.length).toBeGreaterThan(100);
    }
  );

  it('supports mood references without overriding Geometry Guard', () => {
    const pkg = compilePrompt({
      ...baseInput,
      references: [
        { id: 'mood_reference', url: 'https://example.com/mood.png', role: 'MOOD_REFERENCE', lockStrength: 'HIGH' }
      ]
    });

    expect(pkg.referenceInstructions[0]).toContain('Mood reference');
    expect(pkg.referenceInstructions[0]).toContain('do not let it override Geometry Guard');
  });

  it('compresses an oversized engine prompt to the hard limit', () => {
    const pkg = compilePrompt({
      ...baseInput,
      userBrief: 'A '.repeat(1800)
    });

    expect(pkg.enginePrompt.length).toBeLessThanOrEqual(2000);
    expect(pkg.warnings.length).toBeGreaterThan(0);
  });
});

describe('Architecture compile validation', () => {
  it('accepts a valid Phase 3 request', () => {
    const result = architectureCompileSchema.safeParse({
      domain: 'ARCHITECTURE',
      templateId: 'template_1',
      workflowType: 'exterior_render',
      engineKey: 'flux',
      geometryGuard: 'SEMI_FIXED_GEOMETRY',
      userBrief: 'Create a restrained contemporary villa visualization.',
      selections: [{ optionId: 'option_1', groupKey: 'style', value: 'contemporary' }],
      references: []
    });

    expect(result.success).toBe(true);
  });

  it('rejects unsupported engines and short briefs', () => {
    const result = architectureCompileSchema.safeParse({
      domain: 'ARCHITECTURE',
      templateId: 'template_1',
      workflowType: 'exterior_render',
      engineKey: 'unsupported_engine',
      geometryGuard: 'FIXED_GEOMETRY',
      userBrief: 'short',
      selections: []
    });

    expect(result.success).toBe(false);
  });
});
