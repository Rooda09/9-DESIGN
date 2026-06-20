import { prisma } from '../db';

export type AdminFieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'json';

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  helpText?: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ value: string; label: string }>;
  relation?: {
    resource: AdminResourceSlug;
    labelField: string;
  };
}

export interface AdminResource {
  slug: string;
  title: string;
  description: string;
  model: string;
  idField: string;
  fields: AdminField[];
  tableColumns: string[];
  orderBy?: unknown;
}

export type AdminResourceSlug =
  | 'domains'
  | 'dropdown-groups'
  | 'dropdown-options'
  | 'templates'
  | 'prompt-library'
  | 'clip-scenarios'
  | 'ai-engines'
  | 'upscale-categories'
  | 'upscale-settings'
  | 'audio-categories'
  | 'audio-settings';

const domainOptions = [
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'BRANDING', label: 'Branding' }
];

const engineTypeOptions = [
  { value: 'IMAGE', label: 'Image' },
  { value: 'CLIP', label: 'Clip' },
  { value: 'AUDIO', label: 'Audio' },
  { value: 'UPSCALE', label: 'Upscale' }
];

export const ADMIN_RESOURCES: Record<AdminResourceSlug, AdminResource> = {
  domains: {
    slug: 'domains',
    title: 'Domains',
    description: 'Manage the top-level creative domains available to templates, prompt records, and scenarios.',
    model: 'domain',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'labelAr', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'key', label: 'Domain key', type: 'select', required: true, options: domainOptions },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 }
    ]
  },
  'dropdown-groups': {
    slug: 'dropdown-groups',
    title: 'Dropdown groups',
    description: 'Manage admin-editable dropdown group definitions for each creative workflow.',
    model: 'dropdownGroup',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'labelAr', 'isRequired', 'isAdvanced', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'domainId', label: 'Domain', type: 'select', relation: { resource: 'domains', labelField: 'labelEn' } },
      { name: 'key', label: 'Group key', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'isRequired', label: 'Required', type: 'checkbox' },
      { name: 'isAdvanced', label: 'Advanced control', type: 'checkbox' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 }
    ]
  },
  'dropdown-options': {
    slug: 'dropdown-options',
    title: 'Dropdown options',
    description: 'Manage selectable admin-controlled options with defaults, best-for guidance, bilingual descriptions, active status, and sort order.',
    model: 'dropdownOption',
    idField: 'id',
    tableColumns: ['value', 'labelEn', 'labelAr', 'isDefault', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'groupId', label: 'Dropdown group', type: 'select', required: true, relation: { resource: 'dropdown-groups', labelField: 'labelEn' } },
      { name: 'value', label: 'Stored value', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'isDefault', label: 'Default value', type: 'checkbox' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
      { name: 'metadata', label: 'Metadata JSON', type: 'json', helpText: 'Optional JSON object for provider hints or future admin metadata.' }
    ]
  },
  templates: {
    slug: 'templates',
    title: 'Templates',
    description: 'Manage workflow templates used by the create studio foundation.',
    model: 'template',
    idField: 'id',
    tableColumns: ['key', 'titleEn', 'titleAr', 'workflowType', 'isPublished', 'version'],
    orderBy: [{ updatedAt: 'desc' }],
    fields: [
      { name: 'domainId', label: 'Domain', type: 'select', required: true, relation: { resource: 'domains', labelField: 'labelEn' } },
      { name: 'key', label: 'Template key', type: 'text', required: true },
      { name: 'titleEn', label: 'English title', type: 'text', required: true },
      { name: 'titleAr', label: 'Arabic title', type: 'text', required: true },
      { name: 'workflowType', label: 'Workflow type', type: 'text', required: true },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'defaultEngineKey', label: 'Default engine key', type: 'text' },
      { name: 'defaultDropdowns', label: 'Default dropdowns JSON', type: 'json' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'version', label: 'Version', type: 'number', defaultValue: 1 }
    ]
  },
  'prompt-library': {
    slug: 'prompt-library',
    title: 'Prompt library',
    description: 'Manage admin-owned prompt library records. User personal libraries are out of scope for Phase 2.',
    model: 'promptTemplate',
    idField: 'id',
    tableColumns: ['key', 'titleEn', 'category', 'isPublished', 'version', 'maxCharacters'],
    orderBy: [{ updatedAt: 'desc' }],
    fields: [
      { name: 'domainId', label: 'Domain', type: 'select', required: true, relation: { resource: 'domains', labelField: 'labelEn' } },
      { name: 'key', label: 'Prompt key', type: 'text', required: true },
      { name: 'titleEn', label: 'English title', type: 'text', required: true },
      { name: 'titleAr', label: 'Arabic title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'promptBody', label: 'Prompt body', type: 'textarea', required: true },
      { name: 'negativePrompt', label: 'Negative prompt', type: 'textarea' },
      { name: 'engineHints', label: 'Engine hints JSON', type: 'json' },
      { name: 'maxCharacters', label: 'Max characters', type: 'number', defaultValue: 2000 },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'version', label: 'Version', type: 'number', defaultValue: 1 }
    ]
  },
  'clip-scenarios': {
    slug: 'clip-scenarios',
    title: 'Clip scenarios',
    description: 'Manage reusable admin-authored clip scenario records.',
    model: 'clipScenario',
    idField: 'id',
    tableColumns: ['key', 'titleEn', 'category', 'durationSeconds', 'audioRequired', 'isPublished'],
    orderBy: [{ updatedAt: 'desc' }],
    fields: [
      { name: 'domainId', label: 'Domain', type: 'select', required: true, relation: { resource: 'domains', labelField: 'labelEn' } },
      { name: 'key', label: 'Scenario key', type: 'text', required: true },
      { name: 'titleEn', label: 'English title', type: 'text', required: true },
      { name: 'titleAr', label: 'Arabic title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'style', label: 'Style', type: 'text' },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'scenarioPrompt', label: 'Scenario prompt', type: 'textarea', required: true },
      { name: 'storyArc', label: 'Story arc', type: 'textarea' },
      { name: 'cameraMotion', label: 'Camera motion', type: 'textarea' },
      { name: 'durationSeconds', label: 'Duration seconds', type: 'number', defaultValue: 8 },
      { name: 'audioRequired', label: 'Audio required', type: 'checkbox' },
      { name: 'audioMood', label: 'Audio mood', type: 'text' },
      { name: 'audioPrompt', label: 'Audio prompt', type: 'textarea' },
      { name: 'sfxDirection', label: 'SFX direction', type: 'textarea' },
      { name: 'voiceoverUse', label: 'Voiceover use', type: 'text' },
      { name: 'engineHints', label: 'Engine hints JSON', type: 'json' },
      { name: 'maxCharacters', label: 'Max characters', type: 'number', defaultValue: 2000 },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
      { name: 'version', label: 'Version', type: 'number', defaultValue: 1 }
    ]
  },
  'ai-engines': {
    slug: 'ai-engines',
    title: 'AI engines',
    description: 'Manage engine metadata and capability flags. Provider execution remains out of scope.',
    model: 'aIEngine',
    idField: 'id',
    tableColumns: ['key', 'name', 'type', 'provider', 'isActive', 'defaultTokenCost'],
    orderBy: [{ name: 'asc' }],
    fields: [
      { name: 'key', label: 'Engine key', type: 'text', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true, options: engineTypeOptions },
      { name: 'provider', label: 'Provider', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'supportsImageToImage', label: 'Supports image to image', type: 'checkbox' },
      { name: 'supportsTextToImage', label: 'Supports text to image', type: 'checkbox' },
      { name: 'supportsImageToVideo', label: 'Supports image to video', type: 'checkbox' },
      { name: 'supportsTextToVideo', label: 'Supports text to video', type: 'checkbox' },
      { name: 'supportsAudio', label: 'Supports audio', type: 'checkbox' },
      { name: 'supportsUpscale', label: 'Supports upscale', type: 'checkbox' },
      { name: 'supportsReferenceLock', label: 'Supports reference lock', type: 'checkbox' },
      { name: 'defaultTokenCost', label: 'Default token cost', type: 'number', defaultValue: 0 },
      { name: 'config', label: 'Config JSON', type: 'json' }
    ]
  },
  'upscale-categories': {
    slug: 'upscale-categories',
    title: 'Upscale categories',
    description: 'Manage admin categories for upscale settings.',
    model: 'upscaleCategory',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'labelAr', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'key', label: 'Category key', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 }
    ]
  },
  'upscale-settings': {
    slug: 'upscale-settings',
    title: 'Upscale settings',
    description: 'Manage selectable upscale modes, provider hints, token costs, defaults, and active status.',
    model: 'upscaleSetting',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'providerKey', 'targetResolution', 'isDefault', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'categoryId', label: 'Upscale category', type: 'select', required: true, relation: { resource: 'upscale-categories', labelField: 'labelEn' } },
      { name: 'key', label: 'Setting key', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'providerKey', label: 'Provider key', type: 'text' },
      { name: 'mode', label: 'Mode', type: 'text' },
      { name: 'targetResolution', label: 'Target resolution', type: 'text' },
      { name: 'preserveRealism', label: 'Preserve realism', type: 'checkbox', defaultValue: true },
      { name: 'tokenCost', label: 'Token cost', type: 'number', defaultValue: 0 },
      { name: 'isDefault', label: 'Default value', type: 'checkbox' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
      { name: 'config', label: 'Config JSON', type: 'json' }
    ]
  },
  'audio-categories': {
    slug: 'audio-categories',
    title: 'Audio background categories',
    description: 'Manage admin categories for audio background settings.',
    model: 'audioBackgroundCategory',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'labelAr', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'key', label: 'Category key', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 }
    ]
  },
  'audio-settings': {
    slug: 'audio-settings',
    title: 'Audio background settings',
    description: 'Manage selectable audio background settings, defaults, active status, and provider prompt fragments.',
    model: 'audioBackgroundSetting',
    idField: 'id',
    tableColumns: ['key', 'labelEn', 'mood', 'genre', 'isDefault', 'isActive', 'sortOrder'],
    orderBy: [{ sortOrder: 'asc' }, { labelEn: 'asc' }],
    fields: [
      { name: 'categoryId', label: 'Audio category', type: 'select', required: true, relation: { resource: 'audio-categories', labelField: 'labelEn' } },
      { name: 'key', label: 'Setting key', type: 'text', required: true },
      { name: 'labelEn', label: 'English label', type: 'text', required: true },
      { name: 'labelAr', label: 'Arabic label', type: 'text', required: true },
      { name: 'bestFor', label: 'Best for', type: 'textarea' },
      { name: 'descriptionEn', label: 'English description', type: 'textarea' },
      { name: 'descriptionAr', label: 'Arabic description', type: 'textarea' },
      { name: 'mood', label: 'Mood', type: 'text' },
      { name: 'genre', label: 'Genre', type: 'text' },
      { name: 'tempo', label: 'Tempo', type: 'text' },
      { name: 'ambience', label: 'Ambience', type: 'textarea' },
      { name: 'promptFragment', label: 'Prompt fragment', type: 'textarea' },
      { name: 'sfxDirection', label: 'SFX direction', type: 'textarea' },
      { name: 'defaultDurationSeconds', label: 'Default duration seconds', type: 'number', defaultValue: 8 },
      { name: 'isDefault', label: 'Default value', type: 'checkbox' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
      { name: 'config', label: 'Config JSON', type: 'json' }
    ]
  }
};

export const ADMIN_NAV_ITEMS = Object.values(ADMIN_RESOURCES);

export interface AdminValidationResult {
  ok: boolean;
  data: Record<string, unknown>;
  errors: string[];
}

export function getAdminResource(slug: string): AdminResource | undefined {
  return ADMIN_RESOURCES[slug as AdminResourceSlug];
}

export function getAdminDelegate(resource: AdminResource) {
  const delegate = (prisma as unknown as Record<string, unknown>)[resource.model];
  if (!delegate) throw new Error(`Missing Prisma delegate for ${resource.model}.`);
  return delegate as {
    findMany(args?: unknown): Promise<Record<string, unknown>[]>;
    findUnique(args: unknown): Promise<Record<string, unknown> | null>;
    create(args: unknown): Promise<Record<string, unknown>>;
    update(args: unknown): Promise<Record<string, unknown>>;
    delete(args: unknown): Promise<Record<string, unknown>>;
  };
}

export function formDataToObject(formData: FormData): Record<string, unknown> {
  return Object.fromEntries(Array.from(formData.entries()));
}

function parseJsonField(value: string, field: AdminField, errors: string[]): unknown {
  if (!value.trim()) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    errors.push(`${field.label} must be valid JSON.`);
    return undefined;
  }
}

export function validateAdminRecordInput(resource: AdminResource, input: Record<string, unknown>): AdminValidationResult {
  const data: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of resource.fields) {
    const raw = input[field.name];
    const value = typeof raw === 'string' ? raw.trim() : raw;

    if (field.type === 'checkbox') {
      data[field.name] = raw === 'on' || raw === 'true' || raw === '1' || raw === true;
      continue;
    }

    if (field.type === 'number') {
      if (value === undefined || value === '') {
        if (field.required) errors.push(`${field.label} is required.`);
        if (field.defaultValue !== undefined) data[field.name] = field.defaultValue;
        continue;
      }
      const numeric = Number(value);
      if (!Number.isInteger(numeric)) {
        errors.push(`${field.label} must be an integer.`);
      } else {
        data[field.name] = numeric;
      }
      continue;
    }

    if (field.type === 'json') {
      const parsed = parseJsonField(String(value ?? ''), field, errors);
      if (parsed !== undefined) data[field.name] = parsed;
      continue;
    }

    if ((value === undefined || value === '') && field.required) {
      errors.push(`${field.label} is required.`);
      continue;
    }

    if (value !== undefined && value !== '') {
      data[field.name] = value;
    }
  }

  return { ok: errors.length === 0, data, errors };
}

export async function listAdminRecords(resource: AdminResource) {
  return getAdminDelegate(resource).findMany({
    orderBy: resource.orderBy,
    take: 100
  });
}

export async function getAdminRecord(resource: AdminResource, id: string) {
  return getAdminDelegate(resource).findUnique({
    where: { [resource.idField]: id }
  });
}

export async function createAdminRecord(resource: AdminResource, data: Record<string, unknown>) {
  return getAdminDelegate(resource).create({ data });
}

export async function updateAdminRecord(resource: AdminResource, id: string, data: Record<string, unknown>) {
  return getAdminDelegate(resource).update({
    where: { [resource.idField]: id },
    data
  });
}

export async function deleteAdminRecord(resource: AdminResource, id: string) {
  return getAdminDelegate(resource).delete({
    where: { [resource.idField]: id }
  });
}

export async function getRelationOptions(resource: AdminResource) {
  const options: Record<string, Array<{ value: string; label: string }>> = {};

  for (const field of resource.fields) {
    if (!field.relation) continue;
    const related = getAdminResource(field.relation.resource);
    if (!related) continue;
    const rows = await listAdminRecords(related);
    options[field.name] = rows.map(row => ({
      value: String(row[related.idField]),
      label: String(row[field.relation!.labelField] ?? row.key ?? row[related.idField])
    }));
  }

  return options;
}

export function formatAdminValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
