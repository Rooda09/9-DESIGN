export type ArchitectureGeneratorKey =
  | 'plan_generator'
  | 'exterior'
  | 'booth'
  | 'interior'
  | 'furniture'
  | 'landscape'
  | 'urban_design';

export interface ArchitectureGeneratorDefinition {
  key: ArchitectureGeneratorKey;
  label: string;
  navLabel: string;
  description: string;
  groupKeys: readonly string[];
  templateMatchers: readonly string[];
}

export interface ArchitectureGeneratorSection<TGroup, TTemplate> extends ArchitectureGeneratorDefinition {
  groups: TGroup[];
  templates: TTemplate[];
  optionCount: number;
}

export const ARCHITECTURE_GENERATOR_SECTIONS: readonly ArchitectureGeneratorDefinition[] = [
  {
    key: 'plan_generator',
    label: 'Plan Generator',
    navLabel: 'Plan',
    description: 'Set the project sector, workflow intent, Geometry Guard posture, output purpose, and package-level quality checks.',
    groupKeys: [
      'project_sectors',
      'architecture_workflows',
      'geometry_control',
      'output_purpose',
      'quality_gate',
      'upscale_purpose',
      'audio_mood_for_clips',
      'audio_structure'
    ],
    templateMatchers: ['site plan', 'masterplan', 'plan visual']
  },
  {
    key: 'exterior',
    label: 'Exterior',
    navLabel: 'Exterior',
    description: 'Build controlled exterior, facade, villa, tower, hospitality, and marketing render prompt packages.',
    groupKeys: [
      'residential_types',
      'commercial_types',
      'hospitality_types',
      'architecture_styles',
      'facade_systems',
      'materials',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['fixed geometry', 'facade', 'tower', 'real estate', 'villa', 'exterior']
  },
  {
    key: 'booth',
    label: 'Booth',
    navLabel: 'Booth',
    description: 'Organize compact commercial, exhibition-style, kiosk, and branded spatial prompt controls without mixing them into exterior or interior work.',
    groupKeys: [
      'commercial_types',
      'hospitality_types',
      'architecture_workflows',
      'geometry_control',
      'architecture_styles',
      'facade_systems',
      'materials',
      'interior_spaces',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['facade', 'real estate', 'site plan']
  },
  {
    key: 'interior',
    label: 'Interior',
    navLabel: 'Interior',
    description: 'Focus the Studio on rooms, lobbies, galleries, interior materials, lighting, views, and presentation quality.',
    groupKeys: [
      'residential_types',
      'hospitality_types',
      'interior_spaces',
      'architecture_styles',
      'materials',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['interior']
  },
  {
    key: 'furniture',
    label: 'Furniture',
    navLabel: 'Furniture',
    description: 'Prepare architecture-adjacent furniture, built-in, styling, material, scale, and interior presentation controls.',
    groupKeys: [
      'interior_spaces',
      'architecture_styles',
      'materials',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['interior', 'real estate']
  },
  {
    key: 'landscape',
    label: 'Landscape',
    navLabel: 'Landscape',
    description: 'Separate planting, hardscape, gardens, public realm, material, lighting, and camera controls from building-edit prompts.',
    groupKeys: [
      'landscape_urban',
      'geometry_control',
      'materials',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['landscape']
  },
  {
    key: 'urban_design',
    label: 'Urban Design',
    navLabel: 'Urban',
    description: 'Group masterplan, public realm, site, massing, style, camera, lighting, and quality controls for urban-scale work.',
    groupKeys: [
      'project_sectors',
      'landscape_urban',
      'architecture_workflows',
      'geometry_control',
      'architecture_styles',
      'camera_views',
      'lighting_time',
      'output_purpose',
      'quality_gate'
    ],
    templateMatchers: ['site plan', 'tower', 'masterplan', 'urban']
  }
] as const;

export const ARCHITECTURE_GENERATOR_KEYS = ARCHITECTURE_GENERATOR_SECTIONS.map(section => section.key);

export const ARCHITECTURE_WORKBOOK_GROUP_KEYS = [
  'project_sectors',
  'residential_types',
  'commercial_types',
  'hospitality_types',
  'architecture_workflows',
  'geometry_control',
  'architecture_styles',
  'facade_systems',
  'materials',
  'interior_spaces',
  'landscape_urban',
  'camera_views',
  'lighting_time',
  'output_purpose',
  'quality_gate',
  'upscale_purpose',
  'audio_mood_for_clips',
  'audio_structure'
] as const;

export function isArchitectureGeneratorKey(value: string): value is ArchitectureGeneratorKey {
  return ARCHITECTURE_GENERATOR_KEYS.includes(value as ArchitectureGeneratorKey);
}

export function classifyArchitectureTemplateWorkflow(templateName: string): ArchitectureGeneratorKey {
  const name = templateName.toLowerCase();
  if (name.includes('landscape')) return 'landscape';
  if (name.includes('interior')) return 'interior';
  if (name.includes('site plan') || name.includes('masterplan')) return 'plan_generator';
  if (name.includes('tower')) return 'urban_design';
  if (name.includes('real estate')) return 'exterior';
  if (name.includes('facade') || name.includes('villa') || name.includes('fixed geometry')) return 'exterior';
  return 'plan_generator';
}

function templateMatches<TTemplate extends { titleEn: string; workflowType: string }>(
  section: ArchitectureGeneratorDefinition,
  template: TTemplate
) {
  if (template.workflowType === section.key) return true;
  const haystack = `${template.titleEn} ${template.workflowType}`.toLowerCase();
  return section.templateMatchers.some(matcher => haystack.includes(matcher));
}

export function buildArchitectureGeneratorSections<
  TGroup extends { key: string; options?: unknown[] },
  TTemplate extends { titleEn: string; workflowType: string }
>(
  groups: TGroup[],
  templates: TTemplate[]
): ArchitectureGeneratorSection<TGroup, TTemplate>[] {
  const groupByKey = new Map(groups.map(group => [group.key, group]));

  return ARCHITECTURE_GENERATOR_SECTIONS.map(section => {
    const sectionGroups = section.groupKeys.flatMap(key => {
      const group = groupByKey.get(key);
      return group ? [group] : [];
    });
    const sectionTemplates = templates.filter(template => templateMatches(section, template));

    return {
      ...section,
      groups: sectionGroups,
      templates: sectionTemplates.length > 0 ? sectionTemplates : templates,
      optionCount: sectionGroups.reduce((total, group) => total + (group.options?.length ?? 0), 0)
    };
  });
}
