import { describe, expect, it } from 'vitest';
import { compilePrompt } from '../src/lib/prompt-compiler';


describe('compilePrompt', () => {
  it('creates an architecture prompt with geometry lock instructions under 2000 chars', () => {
    const pkg = compilePrompt({
      domain: 'ARCHITECTURE',
      workflowType: 'exterior_render',
      engineKey: 'midjourney',
      userBrief: 'Luxury villa exterior from uploaded SketchUp screenshot',
      selections: [
        { groupKey: 'geometry_guard', value: 'fixed', label: 'Fixed Geometry' },
        { groupKey: 'architectural_style', value: 'contemporary_luxury', label: 'Contemporary Luxury' },
        { groupKey: 'lighting_time', value: 'blue_hour', label: 'Blue Hour' }
      ],
      references: [{ id: 'ref1', url: '/x.png', role: 'GEOMETRY_REFERENCE', lockStrength: 'STRICT' }]
    });

    expect(pkg.enginePrompt.length).toBeLessThanOrEqual(2000);
    expect(pkg.lockInstructions.join(' ')).toContain('Preserve original massing');
  });
});
