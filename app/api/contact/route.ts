import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/contact-mailer';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await rateLimit(ip);

  const body = await request.json();
  const { name, email, phone, company, message } = body || {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Nombre, email y mensaje son obligatorios.' }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, phone, company, message });
    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo enviar el mensaje.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
