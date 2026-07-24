import nodemailer from 'nodemailer';
import { sendContactEmailWithResend } from '@/lib/contact-mailer-resend';

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

function getSmtpConfigs() {
  const host = process.env.SMTP_HOST || 'smtp.zoho.com';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER y SMTP_PASS deben configurarse para Zoho Mail.');
  }

  const explicitPort = Number(process.env.SMTP_PORT || 587);
  const explicitSecure = process.env.SMTP_SECURE === 'true';

  const candidates = [
    { host, port: explicitPort, secure: explicitSecure },
    { host, port: 587, secure: false },
    { host, port: 465, secure: true },
  ];

  return candidates.filter((candidate, index, self) => index === self.findIndex((item) => item.port === candidate.port && item.secure === candidate.secure));
}

export function buildContactEmailPayload(payload: ContactEmailPayload) {
  const toEmail = process.env.CONTACT_TO_EMAIL || 'ceo@velozzacws.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || 'contacto@velozzacws.com';
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

export async function sendContactEmail(payload: ContactEmailPayload) {
  const mailOptions = buildContactEmailPayload(payload);
  const errors: string[] = [];

  if (process.env.RESEND_API_KEY) {
    try {
      return await sendContactEmailWithResend(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`resend: ${message}`);
    }
  }

  for (const config of getSmtpConfigs()) {
    const transporter = nodemailer.createTransport({
      ...config,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${config.port}/${config.secure ? 'ssl' : 'starttls'}: ${message}`);
    }
  }

  throw new Error(`No se pudo enviar el correo. Verifica SMTP_USER, SMTP_PASS o RESEND_API_KEY. Detalles: ${errors.join(' | ')}`);
}
