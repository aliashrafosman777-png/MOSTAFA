const RESEND_API_URL = 'https://api.resend.com';

export interface EmailPayload {
  from?: string;
  to: string | string[];
  subject: string;
  replyTo?: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
  idempotencyKey?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
  unconfigured?: boolean;
}

interface ResendErrorBody {
  message?: string;
  name?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL
  );
}

export function getBusinessEmail(): string {
  return process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || '';
}

export function getSenderEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    'Mostafa Ahmed <website@mostafaconsultant.com>'
  );
}

export async function resendRequest<T>(
  path: string,
  init?: RequestInit
): Promise<{ data?: T; error?: string; unconfigured?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { unconfigured: true, error: 'Resend is not configured.' };

  try {
    const response = await fetch(`${RESEND_API_URL}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    const body = (await response.json().catch(() => ({}))) as T & ResendErrorBody;

    if (!response.ok) {
      const error = body.message || body.name || `Resend returned ${response.status}.`;
      console.error('Resend API error:', error);
      return { error };
    }

    return { data: body };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email request failed.';
    console.error('Resend request failed:', message);
    return { error: message };
  }
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, unconfigured: true };
  }

  const { data, error, unconfigured } = await resendRequest<{ id: string }>(
    '/emails',
    {
      method: 'POST',
      headers: payload.idempotencyKey
        ? { 'Idempotency-Key': payload.idempotencyKey }
        : undefined,
      body: JSON.stringify({
        from: payload.from || getSenderEmail(),
        to: payload.to,
        subject: payload.subject,
        reply_to: payload.replyTo,
        html: payload.html,
        text: payload.text,
        headers: payload.headers,
        tags: payload.tags,
      }),
    }
  );

  if (!data) return { success: false, error, unconfigured };
  return { success: true, id: data.id };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}
