'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0b0b', color: '#f8f5ed', fontFamily: 'var(--font-sans)', padding: '24px' }}>
        <div style={{ maxWidth: '680px', width: '100%', background: 'rgba(18,18,18,0.92)', border: '1px solid rgba(212,175,55,0.16)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#f4cf63', marginTop: 0 }}>Error critico de aplicacion</h2>
          <p style={{ color: '#a7a7a7' }}>Se produjo un error global. Puedes intentar reiniciar esta vista.</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#f8f5ed', fontSize: '12px' }}>{error.message}</pre>
          <button
            onClick={reset}
            style={{
              background: '#f4cf63',
              color: '#0b0b0b',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
