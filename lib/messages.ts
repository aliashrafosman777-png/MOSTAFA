import crypto from 'crypto';
import {
  escapeHtml,
  getBusinessEmail,
  resendRequest,
  sendEmail,
} from '@/lib/email';

const CONTACT_SUBJECT_PREFIX = '[Website inquiry]';
const MESSAGE_MARKER = 'MOSTAFA_CONTACT:';

export interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
  read: boolean;
  createdAt: string;
  deliveryStatus?: string;
}

interface ContactMessageData {
  version: 1;
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
}

interface ResendEmailSummary {
  id: string;
  subject: string;
  created_at: string;
  last_event?: string;
  reply_to?: string[] | string | null;
}

interface ResendEmailList {
  data: ResendEmailSummary[];
  has_more: boolean;
  object: 'list';
}

interface ResendEmailDetail extends ResendEmailSummary {
  html?: string | null;
}

function encodeMessage(data: ContactMessageData): string {
  return Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
}

function decodeMessage(html: string): ContactMessageData | null {
  const match = html.match(/<!--MOSTAFA_CONTACT:([A-Za-z0-9_-]+)-->/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(match[1], 'base64url').toString('utf8')
    ) as ContactMessageData;
    if (parsed.version !== 1 || !parsed.email || !parsed.message) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveMessage(data: {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
}): Promise<{ success: boolean; id?: string; unconfigured?: boolean }> {
  const createdAt = new Date().toISOString();
  const messageData: ContactMessageData = { version: 1, ...data, createdAt };
  const encoded = encodeMessage(messageData);
  const safe = {
    name: escapeHtml(data.name),
    company: escapeHtml(data.company),
    email: escapeHtml(data.email),
    projectType: escapeHtml(data.projectType),
    message: escapeHtml(data.message).replace(/\n/g, '<br>'),
  };
  const inquiryId = crypto.randomUUID();

  const result = await sendEmail({
    to: getBusinessEmail(),
    subject: `${CONTACT_SUBJECT_PREFIX} ${data.name} — ${data.projectType}`,
    replyTo: data.email,
    idempotencyKey: `contact-${inquiryId}`,
    tags: [
      { name: 'source', value: 'website' },
      { name: 'type', value: 'contact_inquiry' },
    ],
    text: [
      'New website inquiry',
      '',
      `Name: ${data.name}`,
      `Company: ${data.company}`,
      `Email: ${data.email}`,
      `Project type: ${data.projectType}`,
      '',
      data.message,
    ].join('\n'),
    html: `
      <!--${MESSAGE_MARKER}${encoded}-->
      <div style="font-family:Arial,sans-serif;color:#17202a;line-height:1.6;max-width:680px;margin:auto">
        <h2 style="margin-bottom:24px">New website inquiry</h2>
        <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
          <tr><td style="padding:8px 12px;color:#667085">Name</td><td style="padding:8px 12px"><strong>${safe.name}</strong></td></tr>
          <tr><td style="padding:8px 12px;color:#667085">Company</td><td style="padding:8px 12px">${safe.company}</td></tr>
          <tr><td style="padding:8px 12px;color:#667085">Email</td><td style="padding:8px 12px"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding:8px 12px;color:#667085">Project type</td><td style="padding:8px 12px">${safe.projectType}</td></tr>
        </table>
        <div style="padding:20px;background:#f7f8fa;border-radius:8px">${safe.message}</div>
      </div>`,
  });

  return { success: result.success, id: result.id, unconfigured: result.unconfigured };
}

async function retrieveMessage(summary: ResendEmailSummary): Promise<ContactMessage | null> {
  const { data } = await resendRequest<ResendEmailDetail>(`/emails/${summary.id}`);
  if (!data?.html) return null;
  const parsed = decodeMessage(data.html);
  if (!parsed) return null;

  return {
    id: summary.id,
    name: parsed.name,
    company: parsed.company,
    email: parsed.email,
    projectType: parsed.projectType,
    message: parsed.message,
    read: false,
    createdAt: parsed.createdAt || summary.created_at,
    deliveryStatus: summary.last_event,
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { data, error } = await resendRequest<ResendEmailList>('/emails?limit=100');
  if (!data) throw new Error(error || 'Unable to load messages from Resend.');

  return data.data
    .filter((email) => email.subject.startsWith(CONTACT_SUBJECT_PREFIX))
    .map((email) => {
      const summary = email.subject.slice(CONTACT_SUBJECT_PREFIX.length).trim();
      const separator = summary.lastIndexOf(' — ');
      const replyTo = Array.isArray(email.reply_to)
        ? email.reply_to[0]
        : email.reply_to || '';
      return {
        id: email.id,
        name: separator >= 0 ? summary.slice(0, separator) : summary,
        company: '',
        email: replyTo,
        projectType: separator >= 0 ? summary.slice(separator + 3) : 'Website inquiry',
        message: '',
        read: false,
        createdAt: email.created_at,
        deliveryStatus: email.last_event,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return retrieveMessage({ id, subject: CONTACT_SUBJECT_PREFIX, created_at: '' });
}
