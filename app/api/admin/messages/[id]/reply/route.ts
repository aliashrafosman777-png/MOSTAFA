import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { escapeHtml, getBusinessEmail, sendEmail } from '@/lib/email';
import { getMessage } from '@/lib/messages';
import { replySchema } from '@/lib/validation';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = (await headers()).get('cookie');
  if (!isAuthenticated(cookieHeader)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const result = replySchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0]?.message || 'Invalid reply.' },
      { status: 400 }
    );
  }

  const { id } = await params;
  const contact = await getMessage(id);
  if (!contact) {
    return NextResponse.json(
      { success: false, message: 'The original message was not found.' },
      { status: 404 }
    );
  }

  const safeMessage = escapeHtml(result.data.message).replace(/\n/g, '<br>');
  const emailResult = await sendEmail({
    to: contact.email,
    subject: result.data.subject,
    replyTo: getBusinessEmail(),
    idempotencyKey: `reply-${id}-${crypto.randomUUID()}`,
    tags: [
      { name: 'source', value: 'admin_dashboard' },
      { name: 'type', value: 'client_reply' },
    ],
    text: result.data.message,
    html: `
      <div style="font-family:Arial,sans-serif;color:#17202a;line-height:1.7;max-width:680px;margin:auto">
        <p>Hello ${escapeHtml(contact.name)},</p>
        <div>${safeMessage}</div>
        <p style="margin-top:32px">Best regards,<br><strong>Mostafa Ahmed</strong><br>Marketing Travel Consultant</p>
      </div>`,
  });

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, message: 'Resend could not send this reply.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Reply sent to ${contact.email}.`,
    emailId: emailResult.id,
    repliedAt: new Date().toISOString(),
  });
}
