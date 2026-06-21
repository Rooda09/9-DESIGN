import {
  ARCHITECTURE_QUALITY_GROUP_KEYS,
  architectureQualityDropdownGroups,
  architectureQualityDropdownOptions,
  architectureQualityPromptTemplates,
  architectureQualityTemplates
} from '../src/config/architecture-quality';
import {
  ARCHITECTURE_CAMERA_MOVEMENT_KEYS,
  ARCHITECTURE_CLIP_DURATIONS,
  ARCHITECTURE_CLIP_ENGINE_KEYS,
  ARCHITECTURE_CONTINUITY_KEYS,
  architectureClipScenarios
} from '../src/config/architecture-clips';
import {
  ARCHITECTURE_AUDIO_DURATIONS,
  ARCHITECTURE_AUDIO_MOOD_KEYS,
  ARCHITECTURE_SFX_DIRECTION_KEYS,
  ARCHITECTURE_UPSCALE_CONTROL_KEYS,
  ARCHITECTURE_UPSCALE_INTENT_KEYS,
  architectureAudioMoods,
  architectureSfxDirections,
  architectureUpscaleControls,
  architectureUpscaleIntents
} from '../src/config/architecture-upscale-audio';
import {
  ARCHITECTURE_GENERATOR_SECTIONS,
  ARCHITECTURE_WORKBOOK_GROUP_KEYS
} from '../src/lib/architecture/generators';
import { loadArchitectureWorkbookData } from '../src/lib/architecture/workbook-data';

const MAX_PROMPT_CHARS = 2000;

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function nonEmpty(value: string | null | undefined) {
  return typeof value === 'string' && value.trim().length > 0;
}

async function main() {
  const workbookData = await loadArchitectureWorkbookData();
  const workbookGroupKeys = workbookData.dropdownGroups.map(group => group.key);
  assert(
    JSON.stringify(workbookGroupKeys) === JSON.stringify(ARCHITECTURE_WORKBOOK_GROUP_KEYS),
    'Phase 4C Architecture workbook groups do not match the expected import order'
  );
  assert(workbookData.dropdownGroups.length === 18, 'Phase 4C workbook should expose 18 Architecture dropdown groups');
  assert(workbookData.dropdownOptions.filter(option => option.isActive).length === 248, 'Phase 4C workbook should expose 248 active Architecture dropdown options');
  assert(workbookData.templates.filter(template => template.isPublished).length === 50, 'Phase 4C workbook should expose 50 published Architecture templates');
  assert(workbookData.promptTemplates.filter(template => template.isPublished).length === 520, 'Phase 4C workbook should expose 520 published Architecture prompt templates');

  const generatorGroupKeys = new Set(ARCHITECTURE_GENERATOR_SECTIONS.flatMap(section => section.groupKeys));
  for (const key of workbookGroupKeys) {
    assert(generatorGroupKeys.has(key), `Workbook group ${key} is not assigned to an Architecture generator section`);
  }
  for (const template of workbookData.promptTemplates) {
    assert(template.promptBody.length <= MAX_PROMPT_CHARS, `Workbook prompt template ${template.key} body exceeds ${MAX_PROMPT_CHARS}`);
    assert(template.negativePrompt.length <= MAX_PROMPT_CHARS, `Workbook prompt template ${template.key} negative prompt exceeds ${MAX_PROMPT_CHARS}`);
  }

  const groupKeys = new Set(architectureQualityDropdownGroups.map(group => group.key));

  for (const key of ARCHITECTURE_QUALITY_GROUP_KEYS) {
    assert(groupKeys.has(key), `Missing Architecture dropdown group: ${key}`);
  }

  for (const group of architectureQualityDropdownGroups) {
    assert(nonEmpty(group.labelEn), `Group ${group.key} missing English label`);
    assert(nonEmpty(group.labelAr), `Group ${group.key} missing Arabic label`);
    assert(nonEmpty(group.descriptionEn), `Group ${group.key} missing English description`);
    assert(nonEmpty(group.descriptionAr), `Group ${group.key} missing Arabic description`);
    assert(Number.isInteger(group.sortOrder), `Group ${group.key} missing sort order`);
    assert(typeof group.isActive === 'boolean', `Group ${group.key} missing active status`);
  }

  const optionsByGroup = new Map<string, typeof architectureQualityDropdownOptions>();
  for (const option of architectureQualityDropdownOptions) {
    assert(groupKeys.has(option.groupKey), `Option ${option.value} references missing group ${option.groupKey}`);
    assert(nonEmpty(option.labelEn), `Option ${option.groupKey}:${option.value} missing English label`);
    assert(nonEmpty(option.labelAr), `Option ${option.groupKey}:${option.value} missing Arabic label`);
    assert(nonEmpty(option.bestFor), `Option ${option.groupKey}:${option.value} missing best-for guidance`);
    assert(nonEmpty(option.descriptionEn), `Option ${option.groupKey}:${option.value} missing English description`);
    assert(nonEmpty(option.descriptionAr), `Option ${option.groupKey}:${option.value} missing Arabic description`);
    assert(Number.isInteger(option.sortOrder), `Option ${option.groupKey}:${option.value} missing sort order`);
    assert(typeof option.isDefault === 'boolean', `Option ${option.groupKey}:${option.value} missing default flag`);
    assert(typeof option.isActive === 'boolean', `Option ${option.groupKey}:${option.value} missing active status`);
    assert(nonEmpty(option.promptFragment), `Option ${option.groupKey}:${option.value} missing prompt fragment`);

    const list = optionsByGroup.get(option.groupKey) ?? [];
    optionsByGroup.set(option.groupKey, [...list, option]);
  }

  for (const key of ARCHITECTURE_QUALITY_GROUP_KEYS) {
    const options = optionsByGroup.get(key) ?? [];
    assert(options.length >= 2, `Group ${key} should have at least two options`);
    assert(options.some(option => option.isDefault), `Group ${key} should define a default option`);
  }

  for (const template of architectureQualityTemplates) {
    assert(nonEmpty(template.titleEn), `Template ${template.key} missing English title`);
    assert(nonEmpty(template.titleAr), `Template ${template.key} missing Arabic title`);
    assert(template.descriptionEn.length <= MAX_PROMPT_CHARS, `Template ${template.key} English description exceeds ${MAX_PROMPT_CHARS}`);
    assert(template.descriptionAr.length <= MAX_PROMPT_CHARS, `Template ${template.key} Arabic description exceeds ${MAX_PROMPT_CHARS}`);
    for (const key of ARCHITECTURE_QUALITY_GROUP_KEYS) {
      assert(nonEmpty(template.defaultDropdowns[key]), `Template ${template.key} missing default for ${key}`);
    }
  }

  for (const promptTemplate of architectureQualityPromptTemplates) {
    assert(promptTemplate.promptBody.length <= MAX_PROMPT_CHARS, `Prompt template ${promptTemplate.key} body exceeds ${MAX_PROMPT_CHARS}`);
    assert(promptTemplate.negativePrompt.length <= MAX_PROMPT_CHARS, `Prompt template ${promptTemplate.key} negative prompt exceeds ${MAX_PROMPT_CHARS}`);
    assert(promptTemplate.maxCharacters <= MAX_PROMPT_CHARS, `Prompt template ${promptTemplate.key} maxCharacters exceeds ${MAX_PROMPT_CHARS}`);
  }

  const scenarioKeys = new Set<string>();
  for (const scenario of architectureClipScenarios) {
    assert(!scenarioKeys.has(scenario.key), `Duplicate Architecture clip scenario key: ${scenario.key}`);
    scenarioKeys.add(scenario.key);
    assert(nonEmpty(scenario.titleEn), `Clip scenario ${scenario.key} missing English title`);
    assert(nonEmpty(scenario.titleAr), `Clip scenario ${scenario.key} missing Arabic title`);
    assert(nonEmpty(scenario.bestFor), `Clip scenario ${scenario.key} missing best-for guidance`);
    assert(nonEmpty(scenario.descriptionEn), `Clip scenario ${scenario.key} missing English description`);
    assert(nonEmpty(scenario.descriptionAr), `Clip scenario ${scenario.key} missing Arabic description`);
    assert(nonEmpty(scenario.openingShot), `Clip scenario ${scenario.key} missing opening shot`);
    assert(nonEmpty(scenario.subjectFocus), `Clip scenario ${scenario.key} missing subject focus`);
    assert(nonEmpty(scenario.atmosphere), `Clip scenario ${scenario.key} missing atmosphere`);
    assert(nonEmpty(scenario.architecturalDetail), `Clip scenario ${scenario.key} missing architectural detail`);
    assert(nonEmpty(scenario.closingShot), `Clip scenario ${scenario.key} missing closing shot`);
    assert(ARCHITECTURE_CAMERA_MOVEMENT_KEYS.includes(scenario.cameraMovement), `Clip scenario ${scenario.key} has invalid camera movement`);
    assert(ARCHITECTURE_CLIP_DURATIONS.includes(scenario.durationSeconds), `Clip scenario ${scenario.key} has invalid duration`);
    for (const key of ARCHITECTURE_CONTINUITY_KEYS) {
      assert(typeof scenario.continuityDefaults[key] === 'boolean', `Clip scenario ${scenario.key} missing continuity default ${key}`);
    }
    for (const engineKey of ARCHITECTURE_CLIP_ENGINE_KEYS) {
      assert(nonEmpty(scenario.engineHints[engineKey]), `Clip scenario ${scenario.key} missing ${engineKey} guidance`);
    }
    assert(scenario.maxCharacters <= MAX_PROMPT_CHARS, `Clip scenario ${scenario.key} exceeds max character policy`);
  }

  const upscaleIntentKeys = new Set(architectureUpscaleIntents.map(intent => intent.key));
  for (const key of ARCHITECTURE_UPSCALE_INTENT_KEYS) {
    assert(upscaleIntentKeys.has(key), `Missing Architecture upscale intent: ${key}`);
  }
  assert(upscaleIntentKeys.size === ARCHITECTURE_UPSCALE_INTENT_KEYS.length, 'Architecture upscale intents contain duplicate keys');

  for (const intent of architectureUpscaleIntents) {
    assert(nonEmpty(intent.labelEn), `Upscale intent ${intent.key} missing English label`);
    assert(nonEmpty(intent.labelAr), `Upscale intent ${intent.key} missing Arabic label`);
    assert(nonEmpty(intent.bestFor), `Upscale intent ${intent.key} missing best-for guidance`);
    assert(nonEmpty(intent.descriptionEn), `Upscale intent ${intent.key} missing English description`);
    assert(nonEmpty(intent.descriptionAr), `Upscale intent ${intent.key} missing Arabic description`);
    assert(nonEmpty(intent.objective), `Upscale intent ${intent.key} missing objective`);
    assert(nonEmpty(intent.enhancementInstruction), `Upscale intent ${intent.key} missing enhancement instruction`);
    assert(nonEmpty(intent.outputFormatNote), `Upscale intent ${intent.key} missing output format note`);
  }

  const upscaleControlKeys = new Set(architectureUpscaleControls.map(control => control.key));
  for (const key of ARCHITECTURE_UPSCALE_CONTROL_KEYS) {
    assert(upscaleControlKeys.has(key), `Missing Architecture upscale control: ${key}`);
  }
  assert(upscaleControlKeys.size === ARCHITECTURE_UPSCALE_CONTROL_KEYS.length, 'Architecture upscale controls contain duplicate keys');

  for (const control of architectureUpscaleControls) {
    assert(nonEmpty(control.labelEn), `Upscale control ${control.key} missing English label`);
    assert(nonEmpty(control.labelAr), `Upscale control ${control.key} missing Arabic label`);
    assert(nonEmpty(control.descriptionEn), `Upscale control ${control.key} missing English description`);
    assert(nonEmpty(control.descriptionAr), `Upscale control ${control.key} missing Arabic description`);
    assert(nonEmpty(control.preservationInstruction), `Upscale control ${control.key} missing preservation instruction`);
    assert(nonEmpty(control.checklistItem), `Upscale control ${control.key} missing checklist item`);
  }

  const audioMoodKeys = new Set(architectureAudioMoods.map(mood => mood.key));
  for (const key of ARCHITECTURE_AUDIO_MOOD_KEYS) {
    assert(audioMoodKeys.has(key), `Missing Architecture audio mood: ${key}`);
  }
  assert(audioMoodKeys.size === ARCHITECTURE_AUDIO_MOOD_KEYS.length, 'Architecture audio moods contain duplicate keys');

  for (const mood of architectureAudioMoods) {
    assert(nonEmpty(mood.labelEn), `Audio mood ${mood.key} missing English label`);
    assert(nonEmpty(mood.labelAr), `Audio mood ${mood.key} missing Arabic label`);
    assert(nonEmpty(mood.bestFor), `Audio mood ${mood.key} missing best-for guidance`);
    assert(nonEmpty(mood.descriptionEn), `Audio mood ${mood.key} missing English description`);
    assert(nonEmpty(mood.descriptionAr), `Audio mood ${mood.key} missing Arabic description`);
    assert(nonEmpty(mood.promptFragment), `Audio mood ${mood.key} missing prompt fragment`);
  }

  const sfxDirectionKeys = new Set(architectureSfxDirections.map(direction => direction.key));
  for (const key of ARCHITECTURE_SFX_DIRECTION_KEYS) {
    assert(sfxDirectionKeys.has(key), `Missing Architecture SFX direction: ${key}`);
  }
  assert(sfxDirectionKeys.size === ARCHITECTURE_SFX_DIRECTION_KEYS.length, 'Architecture SFX directions contain duplicate keys');

  for (const direction of architectureSfxDirections) {
    assert(nonEmpty(direction.labelEn), `SFX direction ${direction.key} missing English label`);
    assert(nonEmpty(direction.labelAr), `SFX direction ${direction.key} missing Arabic label`);
    assert(nonEmpty(direction.bestFor), `SFX direction ${direction.key} missing best-for guidance`);
    assert(nonEmpty(direction.descriptionEn), `SFX direction ${direction.key} missing English description`);
    assert(nonEmpty(direction.descriptionAr), `SFX direction ${direction.key} missing Arabic description`);
    assert(nonEmpty(direction.promptFragment), `SFX direction ${direction.key} missing prompt fragment`);
  }

  for (const duration of ARCHITECTURE_AUDIO_DURATIONS) {
    assert(Number.isInteger(duration), `Audio duration ${duration} must be an integer`);
    assert(duration > 0 && duration <= 20, `Audio duration ${duration} must stay within Phase 4C clip bounds`);
  }

  console.log('Architecture quality data valid');
  console.log({
    workbookGroups: workbookData.dropdownGroups.length,
    workbookOptions: workbookData.dropdownOptions.filter(option => option.isActive).length,
    workbookTemplates: workbookData.templates.filter(template => template.isPublished).length,
    workbookPromptTemplates: workbookData.promptTemplates.filter(template => template.isPublished).length,
    legacyQualityGroups: architectureQualityDropdownGroups.length,
    legacyQualityOptions: architectureQualityDropdownOptions.length,
    legacyQualityTemplates: architectureQualityTemplates.length,
    legacyQualityPromptTemplates: architectureQualityPromptTemplates.length,
    clipScenarios: architectureClipScenarios.length,
    upscaleIntents: architectureUpscaleIntents.length,
    upscaleControls: architectureUpscaleControls.length,
    audioMoods: architectureAudioMoods.length,
    sfxDirections: architectureSfxDirections.length
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
