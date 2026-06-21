import type { Prisma, PrismaClient } from '@prisma/client';
import {
  ARCHITECTURE_WORKBOOK_PATH,
  loadArchitectureWorkbookData,
  type ArchitectureWorkbookData
} from '../src/lib/architecture/workbook-data';

export interface ArchitectureWorkbookImportSummary {
  dropdownGroups: number;
  dropdownOptions: number;
  templates: number;
  promptTemplates: number;
  staleDropdownGroupsDeactivated: number;
}

interface ImportOptions {
  workbookPath?: string;
  data?: ArchitectureWorkbookData;
}

const domainData = {
  labelEn: 'Architecture',
  labelAr: 'Architecture',
  descriptionEn: 'Architecture Studio dataset imported from the validated Phase 4C workbook.',
  descriptionAr: 'Architecture Studio dataset imported from the validated Phase 4C workbook.',
  isActive: true,
  sortOrder: 10
};

export async function importArchitectureWorkbookData(
  prisma: PrismaClient,
  options: ImportOptions = {}
): Promise<ArchitectureWorkbookImportSummary> {
  const data = options.data ?? await loadArchitectureWorkbookData(options.workbookPath ?? ARCHITECTURE_WORKBOOK_PATH);
  const domain = await prisma.domain.upsert({
    where: { key: 'ARCHITECTURE' },
    update: domainData,
    create: {
      key: 'ARCHITECTURE',
      ...domainData
    }
  });

  const activeGroupKeys = data.dropdownGroups.map(group => group.key);
  const staleDropdownGroups = await prisma.dropdownGroup.updateMany({
    where: {
      domainId: domain.id,
      key: { notIn: activeGroupKeys }
    },
    data: { isActive: false }
  });

  const groupIds = new Map<string, string>();
  for (const group of data.dropdownGroups) {
    const record = await prisma.dropdownGroup.upsert({
      where: { key: group.key },
      update: {
        domainId: domain.id,
        labelEn: group.labelEn,
        labelAr: group.labelAr,
        descriptionEn: group.descriptionEn,
        descriptionAr: group.descriptionAr,
        isRequired: group.isRequired,
        isAdvanced: group.isAdvanced,
        sortOrder: group.sortOrder,
        isActive: group.isActive
      },
      create: {
        domainId: domain.id,
        key: group.key,
        labelEn: group.labelEn,
        labelAr: group.labelAr,
        descriptionEn: group.descriptionEn,
        descriptionAr: group.descriptionAr,
        isRequired: group.isRequired,
        isAdvanced: group.isAdvanced,
        sortOrder: group.sortOrder,
        isActive: group.isActive
      }
    });
    groupIds.set(group.key, record.id);
  }

  const optionValuesByGroup = new Map<string, string[]>();
  for (const option of data.dropdownOptions) {
    const groupId = groupIds.get(option.groupKey);
    if (!groupId) throw new Error(`Missing Architecture dropdown group for ${option.groupKey}.`);

    optionValuesByGroup.set(groupId, [...(optionValuesByGroup.get(groupId) ?? []), option.value]);
    await prisma.dropdownOption.upsert({
      where: {
        groupId_value: {
          groupId,
          value: option.value
        }
      },
      update: {
        labelEn: option.labelEn,
        labelAr: option.labelAr,
        bestFor: option.bestFor,
        descriptionEn: option.descriptionEn,
        descriptionAr: option.descriptionAr,
        isDefault: option.isDefault,
        isActive: option.isActive,
        sortOrder: option.sortOrder,
        metadata: {
          source: 'phase_4c_workbook',
          sourceId: option.sourceId,
          promptFragment: option.promptFragment
        }
      },
      create: {
        groupId,
        value: option.value,
        labelEn: option.labelEn,
        labelAr: option.labelAr,
        bestFor: option.bestFor,
        descriptionEn: option.descriptionEn,
        descriptionAr: option.descriptionAr,
        isDefault: option.isDefault,
        isActive: option.isActive,
        sortOrder: option.sortOrder,
        metadata: {
          source: 'phase_4c_workbook',
          sourceId: option.sourceId,
          promptFragment: option.promptFragment
        }
      }
    });
  }

  for (const [groupId, values] of optionValuesByGroup.entries()) {
    await prisma.dropdownOption.updateMany({
      where: {
        groupId,
        value: { notIn: values }
      },
      data: { isActive: false }
    });
  }

  for (const template of data.templates) {
    const existing = await prisma.template.findFirst({
      where: { domainId: domain.id, key: template.key },
      select: { id: true }
    });
    const templateData = {
      domainId: domain.id,
      key: template.key,
      titleEn: template.titleEn,
      titleAr: template.titleAr,
      bestFor: template.bestFor,
      descriptionEn: template.descriptionEn,
      descriptionAr: template.descriptionAr,
      workflowType: template.workflowType,
      defaultEngineKey: template.defaultEngineKey,
      defaultDropdowns: template.defaultDropdowns as Prisma.InputJsonObject,
      isPublished: template.isPublished,
      version: template.version
    };

    if (existing) {
      await prisma.template.update({ where: { id: existing.id }, data: templateData });
    } else {
      await prisma.template.create({ data: templateData });
    }
  }

  for (const template of data.promptTemplates) {
    const existing = await prisma.promptTemplate.findFirst({
      where: { domainId: domain.id, key: template.key },
      select: { id: true }
    });
    const promptTemplateData = {
      domainId: domain.id,
      key: template.key,
      titleEn: template.titleEn,
      titleAr: template.titleAr,
      category: template.category,
      bestFor: template.bestFor,
      descriptionEn: template.descriptionEn,
      descriptionAr: template.descriptionAr,
      promptBody: template.promptBody,
      negativePrompt: template.negativePrompt,
      engineHints: template.engineHints as Prisma.InputJsonObject,
      maxCharacters: template.maxCharacters,
      isPublished: template.isPublished,
      version: template.version
    };

    if (existing) {
      await prisma.promptTemplate.update({ where: { id: existing.id }, data: promptTemplateData });
    } else {
      await prisma.promptTemplate.create({ data: promptTemplateData });
    }
  }

  return {
    dropdownGroups: data.dropdownGroups.length,
    dropdownOptions: data.dropdownOptions.filter(option => option.isActive).length,
    templates: data.templates.filter(template => template.isPublished).length,
    promptTemplates: data.promptTemplates.filter(template => template.isPublished).length,
    staleDropdownGroupsDeactivated: staleDropdownGroups.count
  };
}
