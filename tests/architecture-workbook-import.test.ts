import { describe, expect, it } from 'vitest';
import {
  ARCHITECTURE_GENERATOR_SECTIONS,
  ARCHITECTURE_WORKBOOK_GROUP_KEYS,
  buildArchitectureGeneratorSections
} from '../src/lib/architecture/generators';
import { loadArchitectureWorkbookData } from '../src/lib/architecture/workbook-data';
import type {
  ArchitectureDropdownGroupRecord,
  ArchitectureTemplateRecord
} from '../src/lib/architecture/data';

describe('Phase 4C Architecture workbook import data', () => {
  it('loads the complete validated Architecture dropdown dataset', async () => {
    const data = await loadArchitectureWorkbookData();

    expect(data.dropdownGroups.map(group => group.key)).toEqual(ARCHITECTURE_WORKBOOK_GROUP_KEYS);
    expect(data.dropdownGroups).toHaveLength(18);
    expect(data.dropdownOptions.filter(option => option.isActive)).toHaveLength(248);
    expect(data.templates.filter(template => template.isPublished)).toHaveLength(50);
    expect(data.promptTemplates.filter(template => template.isPublished)).toHaveLength(520);
  });

  it('assigns every imported Architecture dropdown group to at least one generator section', async () => {
    const data = await loadArchitectureWorkbookData();
    const assigned = new Set(ARCHITECTURE_GENERATOR_SECTIONS.flatMap(section => section.groupKeys));

    for (const group of data.dropdownGroups) {
      expect(assigned.has(group.key), `${group.key} should be assigned to a generator section`).toBe(true);
    }
  });
});

describe('Architecture generator grouping', () => {
  it('builds the seven requested Architecture generator sections with option groups', () => {
    const groups = ARCHITECTURE_WORKBOOK_GROUP_KEYS.map((key, index): ArchitectureDropdownGroupRecord => ({
      id: `group_${key}`,
      key,
      labelEn: key,
      labelAr: key,
      descriptionEn: null,
      descriptionAr: null,
      isRequired: index < 5,
      isAdvanced: false,
      sortOrder: index + 1,
      options: [{
        id: `option_${key}`,
        value: `value_${key}`,
        labelEn: `Option ${key}`,
        labelAr: `Option ${key}`,
        bestFor: null,
        descriptionEn: null,
        descriptionAr: null,
        isDefault: true,
        sortOrder: 1,
        promptFragment: null
      }]
    }));
    const templates: ArchitectureTemplateRecord[] = [
      {
        id: 'template_plan',
        key: 'template_plan',
        titleEn: 'Site Plan Visual',
        titleAr: 'Site Plan Visual',
        bestFor: null,
        descriptionEn: null,
        descriptionAr: null,
        workflowType: 'plan_generator',
        defaultEngineKey: 'midjourney',
        defaultDropdowns: {}
      },
      {
        id: 'template_exterior',
        key: 'template_exterior',
        titleEn: 'Facade Redesign',
        titleAr: 'Facade Redesign',
        bestFor: null,
        descriptionEn: null,
        descriptionAr: null,
        workflowType: 'exterior',
        defaultEngineKey: 'midjourney',
        defaultDropdowns: {}
      },
      {
        id: 'template_interior',
        key: 'template_interior',
        titleEn: 'Interior Room Concept',
        titleAr: 'Interior Room Concept',
        bestFor: null,
        descriptionEn: null,
        descriptionAr: null,
        workflowType: 'interior',
        defaultEngineKey: 'midjourney',
        defaultDropdowns: {}
      }
    ];

    const sections = buildArchitectureGeneratorSections(groups, templates);

    expect(sections.map(section => section.label)).toEqual([
      'Plan Generator',
      'Exterior',
      'Booth',
      'Interior',
      'Furniture',
      'Landscape',
      'Urban Design'
    ]);
    expect(sections).toHaveLength(7);
    for (const section of sections) {
      expect(section.groups.length, `${section.label} should expose grouped controls`).toBeGreaterThan(0);
      expect(section.optionCount, `${section.label} should expose choices`).toBeGreaterThan(0);
      expect(section.templates.length, `${section.label} should keep templates selectable`).toBeGreaterThan(0);
    }
  });
});
