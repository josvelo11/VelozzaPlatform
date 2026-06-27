export default function ClientesPage() {
  const crmUrl =
    process.env.NEXT_PUBLIC_CRM_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : 'https://disciplined-wisdom-production-82b0.up.railway.app');

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #090909 0%, #121212 100%)', color: '#f8f5ed' }}>
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f4cf63', fontSize: '12px' }}>CRM de Clientes</p>
            <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(28px, 4vw, 42px)' }}>Espacio aislado para el módulo de clientes</h1>
          </div>
          <a
            href={crmUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#f4cf63',
              color: '#0b0b0b',
              textDecoration: 'none',
              fontWeight: 800,
              borderRadius: '999px',
              padding: '12px 18px',
            }}
          >
            Abrir en ventana aparte
          </a>
        </div>

        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
          <iframe
            title="CRM de Clientes"
            src={crmUrl}
            style={{ width: '100%', height: 'calc(100vh - 128px)', border: 0, display: 'block', background: '#fff' }}
            allow="clipboard-read; clipboard-write; fullscreen"
          />
        </div>
      </section>
    </main>
  );
}