import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { buildLeadWorkbook } from '@/lib/lead-workbook';
import { getDetailedMessages } from '@/lib/messages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ExportState {
  readIds?: unknown;
  repliedIds?: unknown;
  notes?: unknown;
}

function stringSet(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.filter((item): item is string => typeof item === 'string'));
}

function stringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([key, note]) => [key, note.slice(0, 2000)])
  );
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
    const notes = stringMap(body.notes);
    const messages = (await getDetailedMessages()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const workbook = await buildLeadWorkbook(
      messages.map((message, index) => ({
        id: `LD-${String(index + 1001).padStart(4, '0')}`,
        createdAt: message.createdAt,
        name: message.name,
        phone: message.phone,
        position: message.position,
        company: message.company,
        status: repliedIds.has(message.id) || readIds.has(message.id)
          ? 'In Progress'
          : 'New',
        description: message.message,
        email: message.email,
        projectType: message.projectType,
        note: notes[message.id] || '',
      }))
    );
    const filename = `campaign-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;
    const responseBody = workbook.buffer.slice(
      workbook.byteOffset,
      workbook.byteOffset + workbook.byteLength
    ) as ArrayBuffer;

    return new NextResponse(responseBody, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'X-Lead-Count': String(messages.length),
      },
    });
  } catch (error) {
    console.error('Lead export error:', error);
    return NextResponse.json(
      { success: false, message: 'The Excel lead tracker could not be generated.' },
      { status: 502 }
    );
  }
}
