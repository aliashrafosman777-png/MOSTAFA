import ExcelJS from 'exceljs';

export interface LeadWorkbookRow {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  position: string;
  company: string;
  status: string;
  description: string;
  email: string;
  projectType: string;
  note: string;
}

const STATUS_OPTIONS = ['New', 'In Progress', 'Qualified', 'Converted', 'Unqualified'];
const MAX_WORKBOOK_ROWS = 1000;

function cleanText(value: unknown): string {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function excelDate(value: string): Date | string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return cleanText(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
}

function solidFill(color: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
}

function thinBorder(color: string): Partial<ExcelJS.Borders> {
  const side: ExcelJS.Border = { style: 'thin', color: { argb: color } };
  return { top: side, left: side, bottom: side, right: side };
}

export async function buildLeadWorkbook(sourceRows: LeadWorkbookRow[]): Promise<Uint8Array> {
  const rows = sourceRows.map((row) => ({
    ...row,
    id: cleanText(row.id),
    date: excelDate(row.createdAt),
    name: cleanText(row.name),
    phone: cleanText(row.phone),
    position: cleanText(row.position),
    company: cleanText(row.company),
    description: cleanText(row.description),
    email: cleanText(row.email),
    projectType: cleanText(row.projectType),
    note: cleanText(row.note).slice(0, 2000),
  }));
  const statusCounts = rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.status] = (counts[row.status] || 0) + 1;
    return counts;
  }, {});

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Mostafa Ahmed';
  workbook.company = 'Mostafa Ahmed Marketing Travel Consultant';
  workbook.title = 'Campaign Leads Tracker';
  workbook.subject = 'Website campaign leads';
  workbook.keywords = 'leads, campaigns, travel, CRM';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const sheet = workbook.addWorksheet('Campaign Leads', {
    properties: { defaultRowHeight: 20 },
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
    views: [
      {
        state: 'frozen',
        xSplit: 1,
        ySplit: 8,
        topLeftCell: 'B9',
        activeCell: 'B9',
        showGridLines: true,
      },
    ],
  });

  sheet.columns = [
    { key: 'gutter', width: 3.88 },
    { key: 'leadId', width: 14 },
    { key: 'date', width: 14 },
    { key: 'name', width: 22 },
    { key: 'phone', width: 18 },
    { key: 'position', width: 22 },
    { key: 'company', width: 26 },
    { key: 'status', width: 18 },
    { key: 'description', width: 52 },
    { key: 'email', width: 30 },
    { key: 'projectType', width: 24 },
    { key: 'note', width: 34 },
  ];

  sheet.getRow(2).height = 24;
  sheet.getCell('B2').value = 'Campaign Leads Tracker';
  sheet.getCell('B2').font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF111827' } };
  sheet.getCell('B3').value = 'Track, qualify, and manage incoming leads from website campaigns';
  sheet.getCell('B3').font = { name: 'Arial', size: 10, color: { argb: 'FF63748A' } };

  const summaryLabels = ['Total Leads', 'New Leads', 'In Progress', 'Qualified', 'Converted', 'Conversion Rate'];
  summaryLabels.forEach((label, index) => {
    const headerCell = sheet.getCell(5, index + 2);
    headerCell.value = label;
    headerCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF465469' } };
    headerCell.fill = solidFill('FFF0F5F8');
    headerCell.border = thinBorder('FFCCD3E0');
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  sheet.getRow(5).height = 18;
  sheet.getRow(6).height = 26;

  const formulaEndRow = Math.max(MAX_WORKBOOK_ROWS, rows.length + 8);
  const summaryValues: Array<{ formula: string; result: number }> = [
    { formula: `COUNTA(B9:B${formulaEndRow})`, result: rows.length },
    { formula: `COUNTIF(H9:H${formulaEndRow},"New")`, result: statusCounts.New || 0 },
    { formula: `COUNTIF(H9:H${formulaEndRow},"In Progress")`, result: statusCounts['In Progress'] || 0 },
    { formula: `COUNTIF(H9:H${formulaEndRow},"Qualified")`, result: statusCounts.Qualified || 0 },
    { formula: `COUNTIF(H9:H${formulaEndRow},"Converted")`, result: statusCounts.Converted || 0 },
    {
      formula: 'IFERROR(F6/B6,0)',
      result: rows.length ? (statusCounts.Converted || 0) / rows.length : 0,
    },
  ];

  summaryValues.forEach((value, index) => {
    const cell = sheet.getCell(6, index + 2);
    cell.value = value;
    cell.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FF1E293A' } };
    cell.fill = solidFill('FFFFFFFF');
    cell.border = thinBorder('FFCCD3E0');
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  sheet.getCell('G6').numFmt = '0.0%';

  const tableHeaders = [
    'Lead ID',
    'Date',
    'Full Name',
    'Phone Number',
    'Job Position',
    'Company Name',
    'Status',
    'Client Description',
    'Work Email',
    'Project Type',
    'Admin Note',
  ];
  sheet.getRow(8).height = 24;
  tableHeaders.forEach((label, index) => {
    const cell = sheet.getCell(8, index + 2);
    cell.value = label;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = solidFill('FF274E13');
    cell.alignment = {
      horizontal: index < 2 || index === 6 ? 'center' : 'left',
      vertical: 'middle',
    };
  });

  rows.forEach((lead, index) => {
    const rowNumber = index + 9;
    const row = sheet.getRow(rowNumber);
    row.height = 38;
    row.values = [
      null,
      lead.id,
      lead.date,
      lead.name,
      lead.phone,
      lead.position,
      lead.company,
      lead.status,
      lead.description,
      lead.email,
      lead.projectType,
      lead.note,
    ];
    row.font = { name: 'Arial', size: 10, color: { argb: 'FF1F2937' } };
    row.alignment = { vertical: 'middle' };

    for (let column = 2; column <= 12; column += 1) {
      const cell = row.getCell(column);
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
      if (index % 2 === 1) cell.fill = solidFill('FFF8FAF7');
    }

    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).numFmt = 'yyyy-mm-dd';
    row.getCell(5).numFmt = '@';
    row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(9).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    row.getCell(10).alignment = { horizontal: 'left', vertical: 'middle', shrinkToFit: true };
    row.getCell(11).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(12).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
  });

  const lastDataRow = Math.max(rows.length + 8, 9);
  sheet.autoFilter = { from: 'B8', to: `L${lastDataRow}` };
  const statusValidation: ExcelJS.DataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: [`"${STATUS_OPTIONS.join(',')}"`],
    showErrorMessage: true,
    errorTitle: 'Choose a valid status',
    error: `Status must be one of: ${STATUS_OPTIONS.join(', ')}`,
  };
  const validationCollection = sheet as ExcelJS.Worksheet & {
    dataValidations: { add(range: string, validation: ExcelJS.DataValidation): void };
  };
  validationCollection.dataValidations.add(`H9:H${formulaEndRow}`, statusValidation);

  const statusStyles = [
    { text: 'New', fill: 'FFDDEAFE', font: 'FF1D4ED8' },
    { text: 'In Progress', fill: 'FFFFEDB5', font: 'FF9A6700' },
    { text: 'Qualified', fill: 'FFE0E7FF', font: 'FF4338CA' },
    { text: 'Converted', fill: 'FFDCFCE7', font: 'FF166534' },
    { text: 'Unqualified', fill: 'FFFEE2E2', font: 'FFB91C1C' },
  ];
  sheet.addConditionalFormatting({
    ref: `H9:H${formulaEndRow}`,
    rules: statusStyles.map((status, index) => ({
      type: 'expression' as const,
      priority: index + 1,
      formulae: [`H9="${status.text}"`],
      style: {
        fill: solidFill(status.fill),
        font: { color: { argb: status.font }, bold: true },
      },
    })),
  });

  sheet.pageSetup.printTitlesRow = '1:8';
  sheet.pageSetup.printArea = `B2:L${lastDataRow}`;
  sheet.headerFooter.oddFooter = '&LMostafa Ahmed&CWebsite campaign leads&RPage &P of &N';
  sheet.getColumn('E').numFmt = '@';

  return new Uint8Array(await workbook.xlsx.writeBuffer());
}
