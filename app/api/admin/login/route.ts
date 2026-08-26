import { NextResponse } from 'next/server';
import { validateCredentials, createToken, isAuthConfigured } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!isAuthConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Admin login is not configured.' },
        { status: 503 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!validateCredentials(email, password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = createToken();

    const response = NextResponse.json({
      success: true,
      message: 'Login successful.',
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:
        request.headers.get('x-forwarded-proto') === 'https' ||
        new URL(request.url).protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'An error occurred.' },
      { status: 500 }
    );
  }
}
