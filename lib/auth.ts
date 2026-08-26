import crypto from 'crypto';

const TOKEN_EXPIRY_HOURS = 24;

function getAuthConfig() {
  return {
    email: process.env.ADMIN_EMAIL || '',
    password: process.env.ADMIN_PASSWORD || '',
    secret: process.env.ADMIN_SESSION_SECRET || '',
  };
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = crypto.createHash('sha256').update(left).digest();
  const rightHash = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

export function isAuthConfigured(): boolean {
  const config = getAuthConfig();
  return Boolean(config.email && config.password && config.secret.length >= 32);
}

export function validateCredentials(email: string, password: string): boolean {
  const config = getAuthConfig();
  if (!isAuthConfigured()) return false;
  return (
    safeEqual(email.trim().toLowerCase(), config.email.trim().toLowerCase()) &&
    safeEqual(password, config.password)
  );
}

export function createToken(): string {
  const config = getAuthConfig();
  if (!isAuthConfigured()) throw new Error('Admin authentication is not configured.');

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: config.email,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_HOURS * 3600,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): boolean {
  try {
    const config = getAuthConfig();
    if (!isAuthConfigured()) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, payload, signature] = parts;
    const expected = crypto
      .createHmac('sha256', config.secret)
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (!safeEqual(signature, expected)) return false;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      exp?: number;
      role?: string;
      sub?: string;
    };
    return Boolean(
      decoded.exp &&
        decoded.exp >= Math.floor(Date.now() / 1000) &&
        decoded.role === 'admin' &&
        decoded.sub === config.email
    );
  } catch {
    return false;
  }
}

export function isAuthenticated(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return Boolean(match && verifyToken(match[1]));
}
