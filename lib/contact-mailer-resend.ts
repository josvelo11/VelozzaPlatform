import { Resend } from 'resend';

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export function buildContactEmailPayload(payload: ContactEmailPayload) {
  const toEmail = process.env.CONTACT_TO_EMAIL || 'ceo@velozzacws.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contacto@velozzacws.com';
  const subject = `Nuevo mensaje de contacto desde ${payload.name || 'la web'}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 12px;">Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Teléfono:</strong> ${payload.phone || 'No proporcionado'}</p>
      <p><strong>Empresa:</strong> ${payload.company || 'No proporcionada'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${payload.message.replace(/\n/g, '<br />')}</p>
    </div>
  `;

  return {
    from: fromEmail,
    to: [toEmail],
    replyTo: payload.email,
    subject,
    html,
  };
}

export async function sendContactEmailWithResend(payload: ContactEmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY no está configurada.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const mailOptions = buildContactEmailPayload(payload);

  return resend.emails.send({
    from: mailOptions.from,
    to: mailOptions.to,
    replyTo: mailOptions.replyTo,
    subject: mailOptions.subject,
    html: mailOptions.html,
  });
}
