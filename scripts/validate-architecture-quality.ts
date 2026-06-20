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

const MAX_PROMPT_CHARS = 2000;

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function nonEmpty(value: string | null | undefined) {
  return typeof value === 'string' && value.trim().length > 0;
}

function main() {
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

  console.log('Architecture quality data valid');
  console.log({
    groups: architectureQualityDropdownGroups.length,
    options: architectureQualityDropdownOptions.length,
    templates: architectureQualityTemplates.length,
    promptTemplates: architectureQualityPromptTemplates.length,
    clipScenarios: architectureClipScenarios.length
  });
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
