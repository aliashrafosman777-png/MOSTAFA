import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { getMessages } from '@/lib/messages';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieHeader = (await headers()).get('cookie');
  if (!isAuthenticated(cookieHeader)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getMessages();
    return NextResponse.json(
      { success: true, messages, total: messages.length },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Admin inbox error:', error);
    return NextResponse.json(
      { success: false, message: 'The inbox could not be loaded from Resend.' },
      { status: 502 }
    );
  }
}
