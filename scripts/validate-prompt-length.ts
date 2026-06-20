import { inspectWorkbook } from './workbook-inspector';

const workbookPath = process.argv[2] ?? 'data/ai_creative_control_platform_database_v2_expanded.xlsx';
const MAX = 2000;

async function main() {
  const sheets = await inspectWorkbook(workbookPath);
  const targetSheets = ['Prompt_Library_1560', 'Clip_Scenarios_540', 'Prompt_Library_V2', 'Clip_Scenarios_V2'];
  const problems = sheets
    .filter(sheet => targetSheets.includes(sheet.name))
    .flatMap(sheet => sheet.headers
      .map((header, index) => ({ header: header.toLowerCase(), index }))
      .filter(column => column.header.includes('prompt'))
      .filter(column => column.header.length > MAX)
      .map(column => ({ sheet: sheet.name, row: 1, length: column.header.length, value: column.header.slice(0, 120) })));

  if (problems.length) {
    console.error(`Found ${problems.length} prompt/scenario fields above ${MAX} characters.`);
    console.table(problems.slice(0, 20));
    process.exit(1);
  }

  console.log(`Workbook structure readable. No checked prompt/scenario header fields exceed ${MAX} characters.`);
  console.log('Full row-level prompt validation will be implemented with the Phase 11 importer mapping.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
