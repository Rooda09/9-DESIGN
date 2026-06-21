import type { Prisma } from '@prisma/client';
import { prisma } from '../db';
import {
  buildArchitectureGeneratorSections,
  type ArchitectureGeneratorKey,
  type ArchitectureGeneratorSection
} from './generators';

export interface ArchitectureTemplateRecord {
  id: string;
  key: string;
  titleEn: string;
  titleAr: string;
  bestFor: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  workflowType: string;
  defaultEngineKey: string | null;
  defaultDropdowns: Record<string, string>;
}

export interface ArchitectureDropdownOptionRecord {
  id: string;
  value: string;
  labelEn: string;
  labelAr: string;
  bestFor: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  isDefault: boolean;
  sortOrder: number;
  promptFragment: string | null;
}

export interface ArchitectureDropdownGroupRecord {
  id: string;
  key: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  isRequired: boolean;
  isAdvanced: boolean;
  sortOrder: number;
  options: ArchitectureDropdownOptionRecord[];
}

export interface ArchitectureCreationData {
  domain: {
    id: string;
    labelEn: string;
    labelAr: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
  } | null;
  templates: ArchitectureTemplateRecord[];
  groups: ArchitectureDropdownGroupRecord[];
  sections: ArchitectureGeneratorSectionRecord[];
}

export type ArchitectureGeneratorSectionRecord = ArchitectureGeneratorSection<
  ArchitectureDropdownGroupRecord,
  ArchitectureTemplateRecord
> & { key: ArchitectureGeneratorKey };

function stringRecord(value: Prisma.JsonValue | null): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
}

function promptFragment(value: Prisma.JsonValue | null): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const fragment = value.promptFragment;
  return typeof fragment === 'string' ? fragment : null;
}

export async function loadArchitectureCreationData(): Promise<ArchitectureCreationData> {
  const domain = await prisma.domain.findUnique({
    where: { key: 'ARCHITECTURE' }
  });

  if (!domain) {
    return { domain: null, templates: [], groups: [], sections: [] };
  }

  const [templates, groups] = await Promise.all([
    prisma.template.findMany({
      where: {
        domainId: domain.id,
        isPublished: true
      },
      orderBy: [{ titleEn: 'asc' }, { version: 'desc' }]
    }),
    prisma.dropdownGroup.findMany({
      where: {
        isActive: true,
        OR: [{ domainId: domain.id }, { domainId: null }],
        key: {
          notIn: ['audio_background', 'upscale_mode', 'story_arc']
        }
      },
      orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
      include: {
        options: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }]
        }
      }
    })
  ]);

  const mappedTemplates = templates.map(template => ({
    id: template.id,
    key: template.key,
    titleEn: template.titleEn,
    titleAr: template.titleAr,
    bestFor: template.bestFor,
    descriptionEn: template.descriptionEn,
    descriptionAr: template.descriptionAr,
    workflowType: template.workflowType,
    defaultEngineKey: template.defaultEngineKey,
    defaultDropdowns: stringRecord(template.defaultDropdowns)
  }));
  const mappedGroups = groups.map(group => ({
    id: group.id,
    key: group.key,
    labelEn: group.labelEn,
    labelAr: group.labelAr,
    descriptionEn: group.descriptionEn,
    descriptionAr: group.descriptionAr,
    isRequired: group.isRequired,
    isAdvanced: group.isAdvanced,
    sortOrder: group.sortOrder,
    options: group.options.map(option => ({
      id: option.id,
      value: option.value,
      labelEn: option.labelEn,
      labelAr: option.labelAr,
      bestFor: option.bestFor,
      descriptionEn: option.descriptionEn,
      descriptionAr: option.descriptionAr,
      isDefault: option.isDefault,
      sortOrder: option.sortOrder,
      promptFragment: promptFragment(option.metadata)
    }))
  }));

  return {
    domain: {
      id: domain.id,
      labelEn: domain.labelEn,
      labelAr: domain.labelAr,
      descriptionEn: domain.descriptionEn,
      descriptionAr: domain.descriptionAr
    },
    templates: mappedTemplates,
    groups: mappedGroups,
    sections: buildArchitectureGeneratorSections(mappedGroups, mappedTemplates)
  };
}
