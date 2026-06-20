import ExcelJS from 'exceljs';

const workbookPath = process.argv[2] ?? 'data/ai_creative_control_platform_database_v2_expanded.xlsx';
const MAX = 2000;

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const targetSheets = ['Prompt_Library_1560', 'Clip_Scenarios_540'];
  const problems: Array<{ sheet: string; row: number; length: number; value: string }> = [];

  for (const sheetName of targetSheets) {
    const ws = workbook.getWorksheet(sheetName);
    if (!ws) continue;
    const header = ws.getRow(1).values as unknown[];
    const promptCols = header
      .map((v, i) => ({ v: String(v ?? '').toLowerCase(), i }))
      .filter(x => x.v.includes('prompt'));

    ws.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      for (const col of promptCols) {
        const text = String(row.getCell(col.i).value ?? '');
        if (text.length > MAX) {
          problems.push({ sheet: sheetName, row: rowNumber, length: text.length, value: text.slice(0, 120) });
        }
      }
    });
  }

  if (problems.length) {
    console.error(`Found ${problems.length} prompt/scenario fields above ${MAX} characters.`);
    console.table(problems.slice(0, 20));
    process.exit(1);
  }

  console.log(`All checked prompt/scenario fields are <= ${MAX} characters.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
