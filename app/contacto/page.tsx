'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado. Nos contactaremos pronto.');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Contacto' },
        ]}
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Contáctanos</h1>
        <p style={{ fontSize: '18px', color: '#a7a7a7', marginBottom: '40px' }}>
          ¿Listo para transformar tu negocio? Escríbenos y uno de nuestros especialistas se comunicará contigo en 24 horas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '10px',
                  background: '#13130f',
                  color: '#f8f5ed',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '10px',
                  background: '#13130f',
                  color: '#f8f5ed',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '10px',
                  background: '#13130f',
                  color: '#f8f5ed',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Empresa
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '10px',
                  background: '#13130f',
                  color: '#f8f5ed',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Mensaje
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '10px',
                  background: '#13130f',
                  color: '#f8f5ed',
                  fontSize: '14px',
                  minHeight: '150px',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Enviar Mensaje
            </button>
          </form>

          {/* Info de Contacto */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Información de Contacto</h3>

            <div style={{ marginBottom: '30px' }}>
              <h4>Teléfono</h4>
              <a href="tel:+573193677929" style={{ color: '#f4cf63', textDecoration: 'none' }}>
                +57 319 367 7929
              </a>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4>Email</h4>
              <a href="mailto:ceo@velozzacws.com" style={{ color: '#f4cf63', textDecoration: 'none' }}>
                ceo@velozzacws.com
              </a>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4>Redes Sociales</h4>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <a href="https://instagram.com/velozzacws" style={{ color: '#f4cf63' }}>
                  @velozzacws
                </a>
                <a href="https://linkedin.com/company/velozzacws" style={{ color: '#f4cf63' }}>
                  LinkedIn @velozzacws
                </a>
                <a href="https://youtube.com/@velozzacws" style={{ color: '#f4cf63' }}>
                  YouTube @velozzacws
                </a>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f0f0f', padding: '20px', borderRadius: '8px', border: '1px solid rgba(244, 207, 99, 0.16)', color: '#f8f5ed' }}>
            <div style={{ backgroundColor: '#10100d', padding: '20px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.16)', color: '#f8f5ed' }}>
              <h4 style={{ color: '#f8f5ed' }}>Horario de Atención</h4>
              <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
              <p>Sábado: 10:00 AM - 2:00 PM</p>
              <p>Domingo: Cerrado</p>
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
    </main>
  );
}
