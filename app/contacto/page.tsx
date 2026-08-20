'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon } from '@/components/PremiumIcon';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo enviar el mensaje.');
      }

      setStatusType('success');
      setStatusMessage('Mensaje enviado correctamente. Nos contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error instanceof Error ? error.message : 'No se pudo enviar el mensaje.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Contacto' },
        ]}
      />

      <div className="section-shell" style={{ maxWidth: '1100px' }}>
        <div className="reveal" style={{ maxWidth: '700px', marginBottom: '48px' }}>
          <div className="eyebrow">Hablemos</div>
          <h1 className="hero-title" style={{ maxWidth: '14ch', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}>Contáctanos</h1>
          <p className="hero-copy">
            ¿Listo para transformar tu negocio? Escríbenos y uno de nuestros especialistas se comunicará contigo en 24 horas.
          </p>
        </div>

        <div className="contact-grid reveal">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="panel panel-pad contact-form">
            <div className="contact-field">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="contact-field">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="contact-field">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="contact-field">
              <label>Empresa</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="contact-field">
              <label>Mensaje</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            {statusMessage && (
              <div className={`contact-status ${statusType}`}>
                {statusMessage}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="cta-primary magnetic contact-submit">
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>

          {/* Info de Contacto */}
          <div className="panel panel-pad contact-info">
            <h2 className="contact-info-title">Información de Contacto</h2>

            <div className="contact-info-row">
              <div className="contact-info-icon"><PremiumIcon name="chat" size={18} /></div>
              <div>
                <h3>Teléfono</h3>
                <a href="tel:+573053090273" className="contact-info-link">
                  +57 305 309 0273
                </a>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-info-icon"><PremiumIcon name="support" size={18} /></div>
              <div>
                <h3>Email</h3>
                <a href="mailto:ceo@velozzacws.com" className="contact-info-link">
                  ceo@velozzacws.com
                </a>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-info-icon"><PremiumIcon name="instagram" size={18} /></div>
              <div>
                <h3>Redes Sociales</h3>
                <div className="contact-social-links">
                  <a href="https://instagram.com/velozzacws" className="contact-info-link">
                    @velozzacws
                  </a>
                  <a href="https://linkedin.com/company/velozzacws" className="contact-info-link">
                    LinkedIn @velozzacws
                  </a>
                  <a href="https://youtube.com/@velozzacws" className="contact-info-link">
                    YouTube @velozzacws
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-hours">
              <div className="contact-info-icon"><PremiumIcon name="clock" size={18} /></div>
              <div>
                <h4>Horario de Atención</h4>
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 2:00 PM</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQ
        items={[
          {
            question: '¿Cuál es el tiempo de respuesta promedio?',
            answer: 'Respondemos todos los mensajes en máximo 24 horas hábiles.',
          },
          {
            question: '¿Ofrecen consultoría inicial gratuita?',
            answer: 'Sí, ofrecemos una consultoría inicial de 30 minutos sin costo.',
          },
        ]}
      />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          margin-bottom: 64px;
          align-items: start;
        }

        .contact-field {
          margin-bottom: 24px;
        }

        .contact-field label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.86rem;
          letter-spacing: 0.04em;
          color: #efe9d6;
        }

        .contact-field input,
        .contact-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 10px;
          background: #13130f;
          color: #f8f5ed;
          font-size: 14px;
          font-family: var(--font-sans);
          transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
        }

        .contact-field input:hover,
        .contact-field textarea:hover {
          border-color: rgba(244, 207, 99, 0.32);
        }

        .contact-field input:focus,
        .contact-field textarea:focus {
          outline: none;
          border-color: rgba(244, 207, 99, 0.6);
          background: #17170f;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.14);
        }

        .contact-field textarea {
          min-height: 150px;
          resize: vertical;
        }

        .contact-status {
          margin-bottom: 16px;
          padding: 12px;
          border-radius: 8px;
        }

        .contact-status.success {
          background-color: rgba(76, 175, 80, 0.15);
          color: #8ce58f;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .contact-status.error {
          background-color: rgba(220, 53, 69, 0.15);
          color: #ffb4b4;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .contact-submit {
          width: 100%;
        }

        .contact-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .contact-info-title {
          margin: 0 0 24px;
          font-size: 1.3rem;
          color: #f8f5ed;
        }

        .contact-info-row {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .contact-info-icon {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          background: rgba(244, 207, 99, 0.10);
          border: 1px solid rgba(244, 207, 99, 0.18);
          color: #f4cf63;
          flex-shrink: 0;
        }

        .contact-info-row h3 {
          margin: 0 0 6px;
          font-size: 0.95rem;
          color: #efe9d6;
        }

        .contact-info-link {
          color: #f4cf63;
          text-decoration: none;
          font-weight: 600;
          transition: color 200ms ease;
        }

        .contact-info-link:hover {
          color: #fff2c9;
        }

        .contact-social-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .contact-hours {
          display: flex;
          gap: 16px;
          background-color: #10100d;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(212, 175, 55, 0.16);
        }

        .contact-hours h4 {
          margin: 0 0 8px;
          color: #f8f5ed;
        }

        .contact-hours p {
          margin: 0 0 4px;
          color: #a7a7a7;
          font-size: 0.92rem;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
