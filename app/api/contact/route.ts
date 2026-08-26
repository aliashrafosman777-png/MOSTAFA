import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { isEmailConfigured } from '@/lib/email';
import { saveMessage } from '@/lib/messages';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        errors[field] ||= [];
        errors[field].push(issue.message);
      }
      return NextResponse.json(
        { success: false, message: 'Please correct the highlighted fields.', errors },
        { status: 400 }
      );
    }

    if (result.data.honeypot) {
      return NextResponse.json({ success: true, message: 'Thank you for your message.' });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          unconfigured: true,
          message: 'The contact form is temporarily unavailable. Please email directly.',
        },
        { status: 503 }
      );
    }

    const emailResult = await saveMessage({
      name: result.data.name,
      company: result.data.company,
      email: result.data.email,
      projectType: result.data.projectType,
      message: result.data.message,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your message could not be sent. Please try again shortly.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Thank you. Your message has been sent successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
