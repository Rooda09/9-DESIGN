import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

function text(value: string): string {
  return value.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

export interface SheetSummary { name: string; path: string; rowCount: number; columnCount: number; headers: string[] }

export async function inspectWorkbook(path: string): Promise<SheetSummary[]> {
  const zip = await JSZip.loadAsync(await readFile(path));
  const workbookXml = await zip.file('xl/workbook.xml')?.async('string');
  const relsXml = await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
  const sharedXml = await zip.file('xl/sharedStrings.xml')?.async('string');
  if (!workbookXml || !relsXml) throw new Error('Workbook is missing xl/workbook.xml or workbook relationships.');

  const shared = [...(sharedXml ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(match =>
    text([...(match[1] ?? '').matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join(''))
  );
  const relTargets = new Map([...relsXml.matchAll(/<(?:\w+:)?Relationship\b([^>]*)/g)].map(match => {
    const attrs = match[1];
    return [attrs.match(/Id="([^"]+)"/)?.[1], attrs.match(/Target="([^"]+)"/)?.[1]] as const;
  }).filter((entry): entry is readonly [string, string] => Boolean(entry[0] && entry[1])));

  return Promise.all([...workbookXml.matchAll(/<(?:\w+:)?sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)].map(async sheet => {
    const target = relTargets.get(sheet[2]);
    const sheetPath = target?.startsWith('/') ? target.slice(1) : `xl/${target}`;
    const xml = sheetPath ? await zip.file(sheetPath)?.async('string') : undefined;
    if (!xml) return { name: text(sheet[1]), path: sheetPath ?? '', rowCount: 0, columnCount: 0, headers: [] };
    const rows = [...xml.matchAll(/<(?:\w+:)?row[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g)];
    const firstRow = rows[0]?.[1] ?? '';
    const headers = [...firstRow.matchAll(/<(?:\w+:)?c([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)].map(cell => {
      const type = cell[1].includes('t="s"');
      const raw = cell[2].match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1] ?? '';
      return type ? shared[Number(raw)] ?? '' : text(raw);
    });
    const columnCount = Math.max(...rows.map(r => [...r[1].matchAll(/<(?:\w+:)?c\b/g)].length), headers.length, 0);
    return { name: text(sheet[1]), path: sheetPath ?? '', rowCount: rows.length, columnCount, headers };
  }));
}
