import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { getDetailedMessages } from '@/lib/messages';

export const dynamic = 'force-dynamic';

interface ExportState {
  readIds?: unknown;
  repliedIds?: unknown;
}

function stringSet(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.filter((item): item is string => typeof item === 'string'));
}

function csvCell(value: string): string {
  let safeValue = value.replace(/\r\n?/g, '\n');
  // Prevent spreadsheet formulas from executing when a lead enters a value
  // beginning with a formula character. This also preserves +phone numbers.
  if (/^[=+\-@]/.test(safeValue)) safeValue = `'${safeValue}`;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export async function POST(request: Request) {
  const cookieHeader = (await headers()).get('cookie');
  if (!isAuthenticated(cookieHeader)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as ExportState;
    const readIds = stringSet(body.readIds);
    const repliedIds = stringSet(body.repliedIds);
    const messages = (await getDetailedMessages()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const header = [
      'Lead ID',
      'Date',
      'Full Name',
      'Phone Number',
      'Job Position',
      'Company Name',
      'Status',
      'Client Description',
    ];

    const rows = messages.map((message, index) => {
      const status = repliedIds.has(message.id) || readIds.has(message.id)
        ? 'In Progress'
        : 'New';
      return [
        `LD-${String(index + 1001).padStart(4, '0')}`,
        new Date(message.createdAt).toISOString().slice(0, 10),
        message.name,
        message.phone,
        message.position,
        message.company,
        status,
        message.message,
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map((value) => csvCell(String(value || ''))).join(','))
      .join('\r\n');
    const filename = `campaign-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Lead-Count': String(messages.length),
      },
    });
  } catch (error) {
    console.error('Lead export error:', error);
    return NextResponse.json(
      { success: false, message: 'The lead sheet could not be generated.' },
      { status: 502 }
    );
  }
}
