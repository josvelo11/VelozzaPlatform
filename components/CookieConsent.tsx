"use client";

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'velozza:cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#080806',
        borderTop: '1px solid #2a2a22',
        color: '#f4f2ec',
        padding: '18px 20px',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <p style={{ margin: 0, color: '#a3a099', fontSize: '13px', lineHeight: 1.5, maxWidth: 720 }}>
          Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso del sitio. Puedes
          conocer más en nuestra{' '}
          <a href="/politica-de-tratamiento-de-datos" style={{ color: '#f0d98a' }}>
            Política de Tratamiento de Datos
          </a>
          .
        </p>
        <button
          onClick={accept}
          style={{
            background: '#f0d98a',
            color: '#0b0b0b',
            border: 'none',
            borderRadius: '999px',
            padding: '10px 22px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
