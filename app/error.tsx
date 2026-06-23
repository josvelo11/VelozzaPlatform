'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0b0b', color: '#f8f5ed', padding: '24px' }}>
      <div style={{ maxWidth: '640px', width: '100%', background: 'rgba(18,18,18,0.92)', border: '1px solid rgba(212,175,55,0.10)', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ color: '#f4cf63', marginTop: 0 }}>Ocurrio un error</h2>
        <p style={{ marginBottom: '16px' }}>El sistema encontro un problema inesperado. Intenta recargar esta seccion.</p>
        <button
          onClick={reset}
          style={{
            background: '#f4cf63',
            color: '#0b0b0b',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
