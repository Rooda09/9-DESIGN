import { EngineType } from '@prisma/client';
import {
  ARCHITECTURE_CLIP_ENGINES,
  architectureClipScenarios
} from '../src/config/architecture-clips';
import { ARCHITECTURE_IMAGE_ENGINES } from '../src/lib/architecture/config';
import { prisma } from '../src/lib/db';
import {
  architectureQualityDropdownGroups,
  architectureQualityDropdownOptions,
  architectureQualityPromptTemplates,
  architectureQualityTemplates
} from '../src/config/architecture-quality';

const isPreview = process.argv.includes('--preview');

async function preview() {
  console.log('Architecture seed preview');
  console.log({
    imageEngines: ARCHITECTURE_IMAGE_ENGINES.length,
    clipEngines: ARCHITECTURE_CLIP_ENGINES.length,
    clipScenarios: architectureClipScenarios.length,
    dropdownGroups: architectureQualityDropdownGroups.length,
    dropdownOptions: architectureQualityDropdownOptions.length,
    templates: architectureQualityTemplates.length,
    promptTemplates: architectureQualityPromptTemplates.length
  });
}

async function seedArchitectureQualityData() {
  const domain = await prisma.domain.upsert({
    where: { key: 'ARCHITECTURE' },
    update: {
      labelEn: 'Architecture',
      labelAr: 'العمارة',
      descriptionEn: 'Architecture Studio MVP for Geometry Guard, reference roles, database dropdowns, and prompt packages.',
      descriptionAr: 'استوديو العمارة للحد الأدنى القابل للإطلاق مع حماية الهندسة وأدوار المراجع والقوائم وقوالب المطالبات.',
      isActive: true,
      sortOrder: 10
    },
    create: {
      key: 'ARCHITECTURE',
      labelEn: 'Architecture',
      labelAr: 'العمارة',
      descriptionEn: 'Architecture Studio MVP for Geometry Guard, reference roles, database dropdowns, and prompt packages.',
      descriptionAr: 'استوديو العمارة للحد الأدنى القابل للإطلاق مع حماية الهندسة وأدوار المراجع والقوائم وقوالب المطالبات.',
      isActive: true,
      sortOrder: 10
    }
  });

  for (const engine of ARCHITECTURE_IMAGE_ENGINES) {
    await prisma.aIEngine.upsert({
      where: { key: engine.key },
      update: {
        name: engine.name,
        type: EngineType.IMAGE,
        isActive: true,
        supportsTextToImage: true,
        supportsImageToImage: true,
        supportsReferenceLock: true,
        config: { architectureGuidance: engine.guidance }
      },
      create: {
        key: engine.key,
        name: engine.name,
        type: EngineType.IMAGE,
        isActive: true,
        supportsTextToImage: true,
        supportsImageToImage: true,
        supportsReferenceLock: true,
        config: { architectureGuidance: engine.guidance }
      }
    });
  }

  for (const engine of ARCHITECTURE_CLIP_ENGINES) {
    await prisma.aIEngine.upsert({
      where: { key: engine.databaseKey },
      update: {
        name: engine.name,
        type: EngineType.CLIP,
        isActive: true,
        supportsImageToVideo: true,
        supportsTextToVideo: true,
        supportsReferenceLock: true,
        config: {
          architectureGuidance: engine.guidance,
          promptKey: engine.key,
          providerExecution: 'placeholder'
        }
      },
      create: {
        key: engine.databaseKey,
        name: engine.name,
        type: EngineType.CLIP,
        isActive: true,
        supportsImageToVideo: true,
        supportsTextToVideo: true,
        supportsReferenceLock: true,
        config: {
          architectureGuidance: engine.guidance,
          promptKey: engine.key,
          providerExecution: 'placeholder'
        }
      }
    });
  }

  const groupIds = new Map<string, string>();
  for (const group of architectureQualityDropdownGroups) {
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

  for (const option of architectureQualityDropdownOptions) {
    const groupId = groupIds.get(option.groupKey);
    if (!groupId) throw new Error(`Missing dropdown group for option ${option.groupKey}:${option.value}`);

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
        metadata: { promptFragment: option.promptFragment }
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
        metadata: { promptFragment: option.promptFragment }
      }
    });
  }

  for (const template of architectureQualityTemplates) {
    const existing = await prisma.template.findFirst({
      where: { domainId: domain.id, key: template.key },
      select: { id: true }
    });
    const data = {
      domainId: domain.id,
      key: template.key,
      titleEn: template.titleEn,
      titleAr: template.titleAr,
      bestFor: template.bestFor,
      descriptionEn: template.descriptionEn,
      descriptionAr: template.descriptionAr,
      workflowType: template.workflowType,
      defaultEngineKey: template.defaultEngineKey,
      defaultDropdowns: template.defaultDropdowns,
      isPublished: template.isPublished,
      version: template.version
    };

    if (existing) {
      await prisma.template.update({ where: { id: existing.id }, data });
    } else {
      await prisma.template.create({ data });
    }
  }

  for (const template of architectureQualityPromptTemplates) {
    const existing = await prisma.promptTemplate.findFirst({
      where: { domainId: domain.id, key: template.key },
      select: { id: true }
    });
    const data = {
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
      engineHints: template.engineHints,
      maxCharacters: template.maxCharacters,
      isPublished: template.isPublished,
      version: template.version
    };

    if (existing) {
      await prisma.promptTemplate.update({ where: { id: existing.id }, data });
    } else {
      await prisma.promptTemplate.create({ data });
    }
  }

  for (const scenario of architectureClipScenarios) {
    const existing = await prisma.clipScenario.findFirst({
      where: { domainId: domain.id, key: scenario.key },
      select: { id: true }
    });
    const data = {
      domainId: domain.id,
      key: scenario.key,
      titleEn: scenario.titleEn,
      titleAr: scenario.titleAr,
      category: scenario.category,
      style: scenario.style,
      bestFor: scenario.bestFor,
      descriptionEn: scenario.descriptionEn,
      descriptionAr: scenario.descriptionAr,
      scenarioPrompt: scenario.scenarioPrompt,
      storyArc: [
        `Opening: ${scenario.openingShot}`,
        `Focus: ${scenario.subjectFocus}`,
        `Atmosphere: ${scenario.atmosphere}`,
        `Detail: ${scenario.architecturalDetail}`,
        `Closing: ${scenario.closingShot}`
      ].join(' '),
      cameraMotion: scenario.cameraMovement,
      durationSeconds: scenario.durationSeconds,
      audioRequired: false,
      engineHints: {
        openingShot: scenario.openingShot,
        subjectFocus: scenario.subjectFocus,
        cameraMovement: scenario.cameraMovement,
        atmosphere: scenario.atmosphere,
        architecturalDetail: scenario.architecturalDetail,
        closingShot: scenario.closingShot,
        continuityDefaults: scenario.continuityDefaults,
        engineHints: scenario.engineHints
      },
      maxCharacters: scenario.maxCharacters,
      isPublished: scenario.isPublished,
      version: scenario.version
    };

    if (existing) {
      await prisma.clipScenario.update({ where: { id: existing.id }, data });
    } else {
      await prisma.clipScenario.create({ data });
    }
  }

  console.log('Architecture quality seed complete');
  console.log({
    imageEngines: ARCHITECTURE_IMAGE_ENGINES.length,
    clipEngines: ARCHITECTURE_CLIP_ENGINES.length,
    clipScenarios: architectureClipScenarios.length,
    dropdownGroups: architectureQualityDropdownGroups.length,
    dropdownOptions: architectureQualityDropdownOptions.length,
    templates: architectureQualityTemplates.length,
    promptTemplates: architectureQualityPromptTemplates.length
  });
}

async function main() {
  if (isPreview) {
    await preview();
    return;
  }

  await seedArchitectureQualityData();
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
