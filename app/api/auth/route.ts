import { NextResponse } from 'next/server';
import { getCrmUrl } from '@/lib/crm';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await rateLimit(ip);

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
  }

  const response = await fetch(getCrmUrl('/api/clientes/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json({ error: data.error || 'Error de autenticación' }, { status: response.status });
  }

  const tokenValue =
    (typeof data?.token === 'string' && data.token) ||
    (typeof data?.access_token === 'string' && data.access_token) ||
    (typeof data?.session?.access_token === 'string' && data.session.access_token) ||
    'authenticated';

  const nextResponse = NextResponse.json(data);
  nextResponse.cookies.set('sb-auth-token', tokenValue, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  return nextResponse;
}
