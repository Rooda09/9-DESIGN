import { describe, expect, it } from 'vitest';
import { ADMIN_RESOURCES, validateAdminRecordInput } from '../src/lib/admin/resources';

describe('admin resource registry', () => {
  it('covers every Phase 2 admin database section', () => {
    expect(Object.keys(ADMIN_RESOURCES).sort()).toEqual([
      'ai-engines',
      'audio-categories',
      'audio-settings',
      'clip-scenarios',
      'domains',
      'dropdown-groups',
      'dropdown-options',
      'prompt-library',
      'templates',
      'upscale-categories',
      'upscale-settings'
    ]);
  });

  it('keeps dropdown option governance fields explicit', () => {
    const dropdownOptionFields = ADMIN_RESOURCES['dropdown-options'].fields.map(field => field.name);
    expect(dropdownOptionFields).toEqual(expect.arrayContaining([
      'isDefault',
      'bestFor',
      'descriptionEn',
      'descriptionAr',
      'isActive',
      'sortOrder'
    ]));
  });

  it('validates and normalizes admin form input', () => {
    const result = validateAdminRecordInput(ADMIN_RESOURCES['dropdown-options'], {
      groupId: 'group_1',
      value: 'minimal',
      labelEn: 'Minimal',
      labelAr: 'Baseet',
      sortOrder: '3',
      isDefault: 'on',
      metadata: '{"providerHint":"clean"}'
    });

    expect(result.ok).toBe(true);
    expect(result.data).toMatchObject({
      groupId: 'group_1',
      value: 'minimal',
      labelEn: 'Minimal',
      labelAr: 'Baseet',
      sortOrder: 3,
      isDefault: true,
      isActive: false,
      metadata: { providerHint: 'clean' }
    });
  });

  it('reports required-field and JSON validation errors', () => {
    const result = validateAdminRecordInput(ADMIN_RESOURCES.templates, {
      domainId: '',
      key: '',
      titleEn: 'Homepage hero',
      titleAr: 'Wajha',
      workflowType: 'hero',
      defaultDropdowns: '{broken'
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([
      'Domain is required.',
      'Template key is required.',
      'Default dropdowns JSON must be valid JSON.'
    ]));
  });
});
