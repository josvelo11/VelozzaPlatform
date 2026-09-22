'use client';
import { useState } from 'react';

export function LeadForm({ source }: { source: string }) {
  const [st, setSt] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSt('sending');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), phone: f.get('phone'),
          message: `Lead guía de poses (${source}). Fecha de boda: ${f.get('date') || 'sin definir'}. Ciudad: ${f.get('city') || 'sin definir'}. Pide la guía de bolsillo de 12 poses.`,
        }),
      });
      setSt(r.ok ? 'ok' : 'err');
    } catch { setSt('err'); }
  }
  if (st === 'ok')
    return (
      <p className="pz-ok">
        ¡Listo!{' '}
        <a href="/guia-poses-novias/guia-bolsillo-12-poses.pdf" download style={{ color: 'inherit', textDecoration: 'underline' }}>
          Descarga tu guía de bolsillo aquí
        </a>
        . También te escribiremos por correo o WhatsApp con el portafolio real de Velozza.
      </p>
    );
  return (
    <form className="pz-form" onSubmit={onSubmit}>
      <input name="name" required placeholder="Tu nombre" aria-label="Tu nombre" />
      <input name="email" type="email" required placeholder="Correo" aria-label="Correo" />
      <input name="phone" placeholder="WhatsApp" aria-label="WhatsApp" />
      <input name="date" placeholder="Fecha de tu boda (opcional)" aria-label="Fecha de tu boda" />
      <input name="city" placeholder="Ciudad" aria-label="Ciudad" />
      <button type="submit" className="cta-primary" disabled={st === 'sending'}>{st === 'sending' ? 'Enviando…' : 'Quiero mi guía de bolsillo'}</button>
      {st === 'err' && <p className="pz-err">No se pudo enviar. Escríbenos por WhatsApp.</p>}
      <small>Al enviar aceptas que te contactemos por correo o WhatsApp. Puedes pedir la baja cuando quieras.</small>
    </form>
  );
}
