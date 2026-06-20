import type {
  ArchitectureDropdownGroupRecord,
  ArchitectureTemplateRecord
} from './data';

export type ArchitectureSelectionState = Record<string, string>;

export function selectableArchitectureGroups(groups: ArchitectureDropdownGroupRecord[]) {
  return groups.filter(group => group.key !== 'geometry_guard' && group.options.length > 0);
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
