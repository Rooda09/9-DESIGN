import type { Prisma } from '@prisma/client';
import {
  architectureClipScenarios,
  type ArchitectureCameraMovementKey,
  type ArchitectureClipDuration,
  type ArchitectureClipScenarioSeed,
  type ArchitectureContinuityState
} from '../../../config/architecture-clips';
import { prisma } from '../../db';

export interface ArchitectureClipScenarioRecord extends ArchitectureClipScenarioSeed {
  id: string;
}

export interface ArchitectureClipCreationData {
  source: 'database' | 'curated-fallback';
  scenarios: ArchitectureClipScenarioRecord[];
}

function fallbackRecords(): ArchitectureClipScenarioRecord[] {
  return architectureClipScenarios.map(scenario => ({
    ...scenario,
    id: `seed:${scenario.key}`
  }));
}

function jsonObject(value: Prisma.JsonValue | null) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Prisma.JsonObject
    : {};
}

function stringValue(object: Prisma.JsonObject, key: string, fallback: string) {
  return typeof object[key] === 'string' ? object[key] as string : fallback;
}

function continuityValue(
  value: Prisma.JsonValue | undefined,
  fallback: ArchitectureContinuityState
): ArchitectureContinuityState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  return {
    preserveBuildingGeometry: typeof value.preserveBuildingGeometry === 'boolean'
      ? value.preserveBuildingGeometry
      : fallback.preserveBuildingGeometry,
    preserveFacadeOpenings: typeof value.preserveFacadeOpenings === 'boolean'
      ? value.preserveFacadeOpenings
      : fallback.preserveFacadeOpenings,
    preserveMaterialPalette: typeof value.preserveMaterialPalette === 'boolean'
      ? value.preserveMaterialPalette
      : fallback.preserveMaterialPalette,
    preserveLightingMood: typeof value.preserveLightingMood === 'boolean'
      ? value.preserveLightingMood
      : fallback.preserveLightingMood,
    preserveCameraDirection: typeof value.preserveCameraDirection === 'boolean'
      ? value.preserveCameraDirection
      : fallback.preserveCameraDirection
  };
}

function engineHintsValue(
  value: Prisma.JsonValue | undefined,
  fallback: ArchitectureClipScenarioSeed['engineHints']
) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  return {
    kling: typeof value.kling === 'string' ? value.kling : fallback.kling,
    veo: typeof value.veo === 'string' ? value.veo : fallback.veo,
    wan_2_6: typeof value.wan_2_6 === 'string' ? value.wan_2_6 : fallback.wan_2_6
  };
}

export async function loadArchitectureClipCreationData(): Promise<ArchitectureClipCreationData> {
  try {
    const scenarios = await prisma.clipScenario.findMany({
      where: {
        isPublished: true,
        domain: { key: 'ARCHITECTURE', isActive: true }
      },
      orderBy: [{ category: 'asc' }, { titleEn: 'asc' }]
    });

    if (scenarios.length === 0) {
      return { source: 'curated-fallback', scenarios: fallbackRecords() };
    }

    return {
      source: 'database',
      scenarios: scenarios.map(record => {
        const fallback = architectureClipScenarios.find(scenario => scenario.key === record.key)
          ?? architectureClipScenarios[0];
        const metadata = jsonObject(record.engineHints);
        return {
          id: record.id,
          key: record.key,
          titleEn: record.titleEn,
          titleAr: record.titleAr ?? fallback.titleAr,
          category: record.category,
          style: record.style ?? fallback.style,
          bestFor: record.bestFor ?? fallback.bestFor,
          descriptionEn: record.descriptionEn ?? fallback.descriptionEn,
          descriptionAr: record.descriptionAr ?? fallback.descriptionAr,
          scenarioPrompt: record.scenarioPrompt,
          openingShot: stringValue(metadata, 'openingShot', fallback.openingShot),
          subjectFocus: stringValue(metadata, 'subjectFocus', fallback.subjectFocus),
          cameraMovement: stringValue(
            metadata,
            'cameraMovement',
            record.cameraMotion ?? fallback.cameraMovement
          ) as ArchitectureCameraMovementKey,
          atmosphere: stringValue(metadata, 'atmosphere', fallback.atmosphere),
          architecturalDetail: stringValue(metadata, 'architecturalDetail', fallback.architecturalDetail),
          closingShot: stringValue(metadata, 'closingShot', fallback.closingShot),
          durationSeconds: record.durationSeconds as ArchitectureClipDuration,
          continuityDefaults: continuityValue(metadata.continuityDefaults, fallback.continuityDefaults),
          engineHints: engineHintsValue(metadata.engineHints, fallback.engineHints),
          maxCharacters: record.maxCharacters,
          isPublished: record.isPublished,
          version: record.version
        };
      })
    };
  } catch (error) {
    console.error('Falling back to curated Architecture clip scenarios.', error);
    return { source: 'curated-fallback', scenarios: fallbackRecords() };
  }
}
