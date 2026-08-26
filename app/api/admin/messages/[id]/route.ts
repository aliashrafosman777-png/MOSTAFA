import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { getMessage } from '@/lib/messages';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = (await headers()).get('cookie');
  if (!isAuthenticated(cookieHeader)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const message = await getMessage(id);
  if (!message) {
    return NextResponse.json(
      { success: false, message: 'Message not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message });
}
