import { inspectWorkbook } from './workbook-inspector';

const workbookPath = process.argv[2] ?? 'data/ai_creative_control_platform_database_v2_expanded.xlsx';

async function main() {
  const sheets = await inspectWorkbook(workbookPath);
  console.log('Workbook sheets:', sheets.map(sheet => sheet.name));

  // Expected sheets from generated database:
  // README_Dashboard, Main_Domains, Platform_Modules, User_System, AI_Engines,
  // Dropdown_Groups, Dropdown_Options, Templates, Prompt_Library_1560,
  // Clip_Scenarios_540, Community_Competition, Admin_Workflow, Data_Dictionary,
  // plus V2 added sheets for taxonomy/upscale/audio/storytelling depending on workbook version.

  // TODO Codex:
  // 1. Map Dropdown_Groups rows to DropdownGroup model.
  // 2. Map Dropdown_Options rows to DropdownOption model.
  // 3. Map Templates rows to Template model.
  // 4. Map Prompt_Library_1560 rows to PromptTemplate model.
  // 5. Map Clip_Scenarios_540 rows to ClipScenario model.
  // 6. Map AI_Engines rows to AIEngine model.
  // 7. Validate prompt/scenario length <= 2,000 characters.
  // 8. Write invalid rows to an import report.

  for (const sheet of sheets) {
    console.log(`${sheet.name}: ${sheet.rowCount} rows x ${sheet.columnCount} columns`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
