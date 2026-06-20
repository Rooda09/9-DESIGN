import { initialEngines } from '../src/config/engines';
import { defaultDropdownGroups, defaultDropdownOptions } from '../src/config/default-dropdowns';

async function main() {
  // TODO Codex: connect Prisma and upsert domains, engines, dropdown groups, and dropdown options.
  console.log('Seed preview');
  console.log({ engines: initialEngines.length, dropdownGroups: defaultDropdownGroups.length, dropdownOptions: defaultDropdownOptions.length });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
