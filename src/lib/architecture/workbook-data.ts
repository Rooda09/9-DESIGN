import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import {
  classifyArchitectureTemplateWorkflow,
  type ArchitectureGeneratorKey
} from './generators';

export const ARCHITECTURE_WORKBOOK_PATH = 'data/ai_creative_control_platform_database_v2_expanded.xlsx';

export interface ArchitectureWorkbookDropdownGroup {
  sourceId: string;
  key: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  defaultValue: string;
  isRequired: boolean;
  isAdvanced: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ArchitectureWorkbookDropdownOption {
  sourceId: string;
  groupKey: string;
  value: string;
  labelEn: string;
  labelAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  promptFragment: string;
}

export interface ArchitectureWorkbookTemplate {
  sourceId: string;
  key: string;
  titleEn: string;
  titleAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  workflowType: ArchitectureGeneratorKey;
  defaultEngineKey: string;
  defaultDropdowns: Record<string, string>;
  isPublished: boolean;
  version: number;
}

export interface ArchitectureWorkbookPromptTemplate {
  sourceId: string;
  key: string;
  titleEn: string;
  titleAr: string;
  category: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  promptBody: string;
  negativePrompt: string;
  engineHints: Record<string, string | null>;
  maxCharacters: number;
  isPublished: boolean;
  version: number;
}

export interface ArchitectureWorkbookData {
  dropdownGroups: ArchitectureWorkbookDropdownGroup[];
  dropdownOptions: ArchitectureWorkbookDropdownOption[];
  templates: ArchitectureWorkbookTemplate[];
  promptTemplates: ArchitectureWorkbookPromptTemplate[];
}

type CellValue = string | number | boolean | null;
type RowObject = Record<string, CellValue>;

interface WorkbookSheet {
  name: string;
  rows: CellValue[][];
}

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function readAttrs(value: string): Record<string, string> {
  return Object.fromEntries(
    [...value.matchAll(/(?:\w+:)?([\w-]+)="([^"]*)"/g)].map(match => [match[1], decodeXml(match[2])])
  );
}

function columnIndex(ref: string | undefined, fallback: number): number {
  if (!ref) return fallback;
  const letters = ref.match(/[A-Z]+/i)?.[0]?.toUpperCase();
  if (!letters) return fallback;
  return [...letters].reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function normalizePath(path: string): string {
  const parts: string[] = [];
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    parts.push(part);
  }
  return parts.join('/');
}

function parseSharedStrings(sharedXml: string | undefined): string[] {
  if (!sharedXml) return [];
  return [...sharedXml.matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map(match =>
    decodeXml([...(match[1] ?? '').matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(t => t[1]).join(''))
  );
}

function parseCellValue(cellAttrs: Record<string, string>, cellXml: string, sharedStrings: string[]): CellValue {
  const rawValue = cellXml.match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1];

  if (cellAttrs.t === 's') {
    return rawValue === undefined ? null : sharedStrings[Number(rawValue)] ?? '';
  }

  if (cellAttrs.t === 'inlineStr') {
    const inline = [...cellXml.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(t => t[1]).join('');
    return decodeXml(inline);
  }

  if (cellAttrs.t === 'b') return rawValue === '1';
  if (rawValue === undefined) return null;
  const text = decodeXml(rawValue);
  const numeric = Number(text);
  return Number.isFinite(numeric) && text.trim() !== '' ? numeric : text;
}

function parseWorksheetRows(sheetXml: string, sharedStrings: string[]): CellValue[][] {
  return [...sheetXml.matchAll(/<(?:\w+:)?row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g)].map(rowMatch => {
    const row: CellValue[] = [];
    let fallbackIndex = 0;
    for (const cellMatch of rowMatch[1].matchAll(/<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)) {
      const attrs = readAttrs(cellMatch[1]);
      const index = columnIndex(attrs.r, fallbackIndex);
      row[index] = parseCellValue(attrs, cellMatch[2], sharedStrings);
      fallbackIndex = index + 1;
    }
    return row.map(value => value ?? null);
  });
}

async function readWorkbookSheets(path: string): Promise<Map<string, WorkbookSheet>> {
  const zip = await JSZip.loadAsync(await readFile(path));
  const workbookXml = await zip.file('xl/workbook.xml')?.async('string');
  const relsXml = await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
  if (!workbookXml || !relsXml) throw new Error('Workbook is missing xl/workbook.xml or workbook relationships.');

  const sharedStrings = parseSharedStrings(await zip.file('xl/sharedStrings.xml')?.async('string'));
  const relTargets = new Map([...relsXml.matchAll(/<(?:\w+:)?Relationship\b([^>]*)/g)].flatMap(match => {
    const attrs = readAttrs(match[1]);
    return attrs.Id && attrs.Target ? [[attrs.Id, attrs.Target] as const] : [];
  }));

  const sheets = new Map<string, WorkbookSheet>();
  for (const sheetMatch of workbookXml.matchAll(/<(?:\w+:)?sheet\b([^>]*)/g)) {
    const attrs = readAttrs(sheetMatch[1]);
    const target = attrs.id ? relTargets.get(attrs.id) : undefined;
    if (!attrs.name || !target) continue;

    const sheetPath = normalizePath(target.startsWith('/') ? target.slice(1) : `xl/${target}`);
    const sheetXml = await zip.file(sheetPath)?.async('string');
    if (!sheetXml) continue;
    sheets.set(attrs.name, {
      name: attrs.name,
      rows: parseWorksheetRows(sheetXml, sharedStrings)
    });
  }

  return sheets;
}

function text(value: CellValue | undefined): string {
  return String(value ?? '').trim();
}

export function slugifyArchitectureValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function yes(value: CellValue | undefined): boolean {
  return text(value).toLowerCase() === 'yes';
}

function active(value: CellValue | undefined): boolean {
  const normalized = text(value).toLowerCase();
  return normalized === '' || normalized === 'active' || normalized === 'approved' || normalized === 'admin editable';
}

function findHeaderRow(rows: CellValue[][], requiredHeaders: string[]): number {
  return rows.findIndex(row => {
    const labels = row.map(cell => text(cell));
    return requiredHeaders.every(header => labels.includes(header));
  });
}

function objectsFromSheet(sheet: WorkbookSheet | undefined, requiredHeaders: string[]): RowObject[] {
  if (!sheet) throw new Error(`Workbook sheet is missing: ${requiredHeaders.join(', ')}`);
  const headerIndex = findHeaderRow(sheet.rows, requiredHeaders);
  if (headerIndex < 0) throw new Error(`Workbook sheet ${sheet.name} is missing headers: ${requiredHeaders.join(', ')}`);

  const headers = sheet.rows[headerIndex].map(cell => text(cell));
  return sheet.rows.slice(headerIndex + 1)
    .filter(row => row.some(cell => text(cell) !== ''))
    .map(row => Object.fromEntries(headers.flatMap((header, index) => header ? [[header, row[index] ?? null] as const] : [])));
}

function normalizeEngineKey(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes('dall') || normalized.includes('gpt')) return 'gpt_image';
  if (normalized.includes('stable')) return 'stable_diffusion';
  if (normalized.includes('leonardo')) return 'leonardo';
  if (normalized.includes('runway')) return 'runway';
  if (normalized.includes('kling')) return 'kling';
  if (normalized.includes('pika')) return 'pika';
  if (normalized.includes('luma')) return 'luma';
  if (normalized.includes('flux')) return 'flux';
  return 'midjourney';
}

function promptFragment(groupLabel: string, optionLabel: string, description: string): string {
  return [`${groupLabel}: ${optionLabel}`, description].filter(Boolean).join('. ');
}

export async function loadArchitectureWorkbookData(path = ARCHITECTURE_WORKBOOK_PATH): Promise<ArchitectureWorkbookData> {
  const sheets = await readWorkbookSheets(path);
  const rawGroups = objectsFromSheet(sheets.get('Dropdown_Groups'), ['Group_ID', 'Domain', 'Dropdown_Group']);
  const rawOptions = objectsFromSheet(sheets.get('Dropdown_Options'), ['Option_ID', 'Domain', 'Dropdown_Group', 'Option_Value']);
  const rawTemplates = objectsFromSheet(sheets.get('Templates'), ['Template_ID', 'Domain', 'Template_Name']);
  const rawPromptTemplates = objectsFromSheet(sheets.get('Prompt_Library_V2'), ['Prompt_ID', 'Domain', 'Category', 'Prompt_Title']);

  const dropdownGroups = rawGroups
    .filter(row => text(row.Domain) === 'Architecture')
    .map((row, index): ArchitectureWorkbookDropdownGroup => {
      const label = text(row.Dropdown_Group);
      return {
        sourceId: text(row.Group_ID),
        key: slugifyArchitectureValue(label),
        labelEn: label,
        labelAr: label,
        descriptionEn: text(row['English Description']),
        descriptionAr: text(row['Arabic Description']),
        defaultValue: text(row.Default_Value),
        isRequired: yes(row['Required?']),
        isAdvanced: text(row.Visibility).toLowerCase().includes('admin only'),
        sortOrder: (index + 1) * 10,
        isActive: active(row.Admin_Status)
      };
    });

  const groupKeyByLabel = new Map(dropdownGroups.map(group => [group.labelEn, group.key]));
  const defaultByGroup = new Map(dropdownGroups.map(group => [group.key, slugifyArchitectureValue(group.defaultValue)]));
  const defaultDropdowns = Object.fromEntries(
    [...defaultByGroup.entries()].filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  const dropdownOptions = rawOptions
    .filter(row => text(row.Domain) === 'Architecture')
    .flatMap((row): ArchitectureWorkbookDropdownOption[] => {
      const groupLabel = text(row.Dropdown_Group);
      const groupKey = groupKeyByLabel.get(groupLabel);
      if (!groupKey) return [];
      const label = text(row.Option_Value);
      const descriptionEn = text(row['English Description']);
      return [{
        sourceId: text(row.Option_ID),
        groupKey,
        value: slugifyArchitectureValue(label),
        labelEn: label,
        labelAr: label,
        bestFor: text(row['Best For']),
        descriptionEn,
        descriptionAr: text(row['Arabic Description']),
        isDefault: yes(row['Default?']),
        isActive: active(row.Status) && yes(row['User_Can_Select?']),
        sortOrder: Number(row.Sort_Order) || 0,
        promptFragment: promptFragment(groupLabel, label, descriptionEn)
      }];
    });

  const templates = rawTemplates
    .filter(row => text(row.Domain) === 'Architecture')
    .map((row): ArchitectureWorkbookTemplate => {
      const titleEn = text(row.Template_Name);
      const workflowType = classifyArchitectureTemplateWorkflow(titleEn);
      const templateDefaults = {
        ...defaultDropdowns,
        ...(text(row.Default_Control_Mode) ? { geometry_control: slugifyArchitectureValue(text(row.Default_Control_Mode)) } : {})
      };

      return {
        sourceId: text(row.Template_ID),
        key: slugifyArchitectureValue(text(row.Template_ID) || titleEn),
        titleEn,
        titleAr: titleEn,
        bestFor: text(row.Best_For),
        descriptionEn: text(row.English_Description),
        descriptionAr: text(row.Arabic_Description),
        workflowType,
        defaultEngineKey: normalizeEngineKey(text(row.Default_Image_Engine)),
        defaultDropdowns: templateDefaults,
        isPublished: active(row.Admin_Status),
        version: 1
      };
    });

  const promptTemplates = rawPromptTemplates
    .filter(row => text(row.Domain) === 'Architecture')
    .map((row): ArchitectureWorkbookPromptTemplate => ({
      sourceId: text(row.Prompt_ID),
      key: slugifyArchitectureValue(text(row.Prompt_ID) || text(row.Prompt_Title)),
      titleEn: text(row.Prompt_Title),
      titleAr: text(row.Prompt_Title),
      category: slugifyArchitectureValue(text(row.Category)),
      bestFor: text(row.Best_For),
      descriptionEn: text(row.English_Description),
      descriptionAr: text(row.Arabic_Description),
      promptBody: text(row.Prompt_Text),
      negativePrompt: text(row.Negative_Prompt),
      engineHints: {
        outputType: text(row.Output_Type) || null,
        imageCompatibility: text(row.Image_Engine_Compatibility) || null,
        clipCompatibility: text(row.Clip_Engine_Compatibility) || null,
        audioCompatibility: text(row.Audio_Engine_Compatibility) || null,
        controlMode: text(row.Default_Control_Mode) || null,
        storytellingArc: text(row.Storytelling_Arc) || null,
        aspectRatio: text(row.Default_Aspect_Ratio) || null,
        saveMode: text(row.Save_Mode) || null
      },
      maxCharacters: 2000,
      isPublished: active(row.Admin_Status),
      version: 1
    }));

  return {
    dropdownGroups,
    dropdownOptions,
    templates,
    promptTemplates
  };
}
