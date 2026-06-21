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
import {
  architectureAudioMoods,
  architectureSfxDirections,
  architectureUpscaleIntents
} from '../src/config/architecture-upscale-audio';

const isPreview = process.argv.includes('--preview');

async function preview() {
  console.log('Architecture seed preview');
  console.log({
    imageEngines: ARCHITECTURE_IMAGE_ENGINES.length,
    clipEngines: ARCHITECTURE_CLIP_ENGINES.length,
    clipScenarios: architectureClipScenarios.length,
    upscaleIntents: architectureUpscaleIntents.length,
    audioMoods: architectureAudioMoods.length,
    sfxDirections: architectureSfxDirections.length,
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

  const upscaleCategory = await prisma.upscaleCategory.upsert({
    where: { key: 'architecture_upscale_intents' },
    update: {
      labelEn: 'Architecture upscale intents',
      labelAr: 'أهداف تكبير الصور المعمارية',
      descriptionEn: 'Phase 4C Architecture-only upscale prompt intents. Provider execution is a placeholder.',
      descriptionAr: 'أهداف مطالبات تكبير الصور المعمارية في Phase 4C. تنفيذ المزود مؤجل.',
      isActive: true,
      sortOrder: 10
    },
    create: {
      key: 'architecture_upscale_intents',
      labelEn: 'Architecture upscale intents',
      labelAr: 'أهداف تكبير الصور المعمارية',
      descriptionEn: 'Phase 4C Architecture-only upscale prompt intents. Provider execution is a placeholder.',
      descriptionAr: 'أهداف مطالبات تكبير الصور المعمارية في Phase 4C. تنفيذ المزود مؤجل.',
      isActive: true,
      sortOrder: 10
    }
  });

  for (const [index, intent] of architectureUpscaleIntents.entries()) {
    await prisma.upscaleSetting.upsert({
      where: {
        categoryId_key: {
          categoryId: upscaleCategory.id,
          key: intent.key
        }
      },
      update: {
        labelEn: intent.labelEn,
        labelAr: intent.labelAr,
        bestFor: intent.bestFor,
        descriptionEn: intent.descriptionEn,
        descriptionAr: intent.descriptionAr,
        providerKey: 'placeholder',
        mode: intent.key,
        targetResolution: 'planning_only',
        preserveRealism: true,
        tokenCost: 0,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: {
          objective: intent.objective,
          enhancementInstruction: intent.enhancementInstruction,
          outputFormatNote: intent.outputFormatNote,
          providerExecution: 'placeholder'
        }
      },
      create: {
        categoryId: upscaleCategory.id,
        key: intent.key,
        labelEn: intent.labelEn,
        labelAr: intent.labelAr,
        bestFor: intent.bestFor,
        descriptionEn: intent.descriptionEn,
        descriptionAr: intent.descriptionAr,
        providerKey: 'placeholder',
        mode: intent.key,
        targetResolution: 'planning_only',
        preserveRealism: true,
        tokenCost: 0,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: {
          objective: intent.objective,
          enhancementInstruction: intent.enhancementInstruction,
          outputFormatNote: intent.outputFormatNote,
          providerExecution: 'placeholder'
        }
      }
    });
  }

  const audioMoodCategory = await prisma.audioBackgroundCategory.upsert({
    where: { key: 'architecture_audio_moods' },
    update: {
      labelEn: 'Architecture audio moods',
      labelAr: 'أنماط الصوت المعماري',
      descriptionEn: 'Phase 4C Architecture clip background audio prompt moods.',
      descriptionAr: 'أنماط مطالبات الخلفية الصوتية لمقاطع العمارة في Phase 4C.',
      isActive: true,
      sortOrder: 10
    },
    create: {
      key: 'architecture_audio_moods',
      labelEn: 'Architecture audio moods',
      labelAr: 'أنماط الصوت المعماري',
      descriptionEn: 'Phase 4C Architecture clip background audio prompt moods.',
      descriptionAr: 'أنماط مطالبات الخلفية الصوتية لمقاطع العمارة في Phase 4C.',
      isActive: true,
      sortOrder: 10
    }
  });

  for (const [index, mood] of architectureAudioMoods.entries()) {
    await prisma.audioBackgroundSetting.upsert({
      where: {
        categoryId_key: {
          categoryId: audioMoodCategory.id,
          key: mood.key
        }
      },
      update: {
        labelEn: mood.labelEn,
        labelAr: mood.labelAr,
        bestFor: mood.bestFor,
        descriptionEn: mood.descriptionEn,
        descriptionAr: mood.descriptionAr,
        mood: mood.key,
        genre: 'architecture_prompt',
        tempo: 'slow_to_moderate',
        ambience: mood.promptFragment,
        promptFragment: mood.promptFragment,
        defaultDurationSeconds: 10,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: { providerExecution: 'placeholder' }
      },
      create: {
        categoryId: audioMoodCategory.id,
        key: mood.key,
        labelEn: mood.labelEn,
        labelAr: mood.labelAr,
        bestFor: mood.bestFor,
        descriptionEn: mood.descriptionEn,
        descriptionAr: mood.descriptionAr,
        mood: mood.key,
        genre: 'architecture_prompt',
        tempo: 'slow_to_moderate',
        ambience: mood.promptFragment,
        promptFragment: mood.promptFragment,
        defaultDurationSeconds: 10,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: { providerExecution: 'placeholder' }
      }
    });
  }

  const sfxCategory = await prisma.audioBackgroundCategory.upsert({
    where: { key: 'architecture_sfx_directions' },
    update: {
      labelEn: 'Architecture SFX directions',
      labelAr: 'اتجاهات المؤثرات المعمارية',
      descriptionEn: 'Phase 4C subtle SFX directions for Architecture clip audio prompt packages.',
      descriptionAr: 'اتجاهات مؤثرات صوتية خفيفة لحزم مطالبات صوت مقاطع العمارة في Phase 4C.',
      isActive: true,
      sortOrder: 20
    },
    create: {
      key: 'architecture_sfx_directions',
      labelEn: 'Architecture SFX directions',
      labelAr: 'اتجاهات المؤثرات المعمارية',
      descriptionEn: 'Phase 4C subtle SFX directions for Architecture clip audio prompt packages.',
      descriptionAr: 'اتجاهات مؤثرات صوتية خفيفة لحزم مطالبات صوت مقاطع العمارة في Phase 4C.',
      isActive: true,
      sortOrder: 20
    }
  });

  for (const [index, direction] of architectureSfxDirections.entries()) {
    await prisma.audioBackgroundSetting.upsert({
      where: {
        categoryId_key: {
          categoryId: sfxCategory.id,
          key: direction.key
        }
      },
      update: {
        labelEn: direction.labelEn,
        labelAr: direction.labelAr,
        bestFor: direction.bestFor,
        descriptionEn: direction.descriptionEn,
        descriptionAr: direction.descriptionAr,
        mood: 'sfx_direction',
        genre: 'architecture_sfx',
        tempo: 'scene_dependent',
        ambience: direction.promptFragment,
        promptFragment: direction.promptFragment,
        sfxDirection: direction.promptFragment,
        defaultDurationSeconds: 10,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: { providerExecution: 'placeholder' }
      },
      create: {
        categoryId: sfxCategory.id,
        key: direction.key,
        labelEn: direction.labelEn,
        labelAr: direction.labelAr,
        bestFor: direction.bestFor,
        descriptionEn: direction.descriptionEn,
        descriptionAr: direction.descriptionAr,
        mood: 'sfx_direction',
        genre: 'architecture_sfx',
        tempo: 'scene_dependent',
        ambience: direction.promptFragment,
        promptFragment: direction.promptFragment,
        sfxDirection: direction.promptFragment,
        defaultDurationSeconds: 10,
        isDefault: index === 0,
        isActive: true,
        sortOrder: (index + 1) * 10,
        config: { providerExecution: 'placeholder' }
      }
    });
  }

  console.log('Architecture quality seed complete');
  console.log({
    imageEngines: ARCHITECTURE_IMAGE_ENGINES.length,
    clipEngines: ARCHITECTURE_CLIP_ENGINES.length,
    clipScenarios: architectureClipScenarios.length,
    upscaleIntents: architectureUpscaleIntents.length,
    audioMoods: architectureAudioMoods.length,
    sfxDirections: architectureSfxDirections.length,
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
