import { NextResponse } from 'next/server';
import { verifyFormacionCredentials } from '@/lib/formacion-auth-credentials';
import { signFormacionSession } from '@/lib/formacion-auth';

// Límite propio (no el genérico de lib/rate-limit.ts): un login con solo 2
// cuentas fijas necesita un límite mucho más estricto que un formulario de
// contacto, o cualquiera puede probar contraseñas sin freno.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; firstAttemptAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttemptAt: now });
    return false;
  }

  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password || !verifyFormacionCredentials(username, password)) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
  }

  const token = await signFormacionSession(username.trim().toLowerCase());

  const res = NextResponse.json({ ok: true });
  res.cookies.set('formacion_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return res;
}
