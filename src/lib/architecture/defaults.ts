import type {
  ArchitectureDropdownGroupRecord,
  ArchitectureTemplateRecord
} from './data';

export type ArchitectureSelectionState = Record<string, string>;

const SYSTEM_ARCHITECTURE_GROUP_KEYS = new Set([
  'geometry_guard',
  'geometry_guard_mode',
  'reference_role',
  'negative_constraints'
]);

export function selectableArchitectureGroups(groups: ArchitectureDropdownGroupRecord[]) {
  return groups.filter(group => !SYSTEM_ARCHITECTURE_GROUP_KEYS.has(group.key) && group.options.length > 0);
}

export function initialArchitectureSelections(
  template: ArchitectureTemplateRecord | undefined,
  groups: ArchitectureDropdownGroupRecord[]
): ArchitectureSelectionState {
  return Object.fromEntries(selectableArchitectureGroups(groups).flatMap(group => {
    const configured = template?.defaultDropdowns[group.key];
    const option = group.options.find(item => item.value === configured)
      ?? group.options.find(item => item.isDefault)
      ?? (group.isRequired ? group.options[0] : undefined);

    return option ? [[group.key, option.id]] : [];
  }));
}
