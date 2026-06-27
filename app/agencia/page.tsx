import Link from 'next/link';

const modules = [
  {
    title: 'Parrilla de Contenido',
    description: 'Planifica piezas, revisa aprobaciones y controla el estado editorial desde una sola vista.',
    href: '/admin/content',
    accent: '#f4cf63',
  },
  {
    title: 'Social CRM',
    description: 'Centraliza leads, conversaciones y seguimiento comercial por canal social.',
    href: '/admin/social-crm',
    accent: '#7dffb3',
  },
  {
    title: 'Plan y Cliente',
    description: 'Resumen de negocio, redes conectadas y uso del plan para el cliente activo.',
    href: '/clientes',
    accent: '#74b9ff',
  },
  {
    title: 'Calendario Operativo',
    description: 'Visualiza entregas, hitos y fechas de publicación en una agenda clara.',
    href: '/admin/calendar',
    accent: '#c39bd3',
  },
];

const metrics = [
  { label: 'Clientes activos', value: '12' },
  { label: 'Piezas en revisión', value: '8' },
  { label: 'Publicaciones agendadas', value: '24' },
  { label: 'Canales conectados', value: '6' },
];

export default function AgenciaPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #090909 0%, #121212 100%)', color: '#f8f5ed' }}>
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '48px 20px 72px' }}>
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f4cf63', fontSize: '12px' }}>Panel de Agencia</p>
            <h1 style={{ margin: '12px 0 14px', fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.02 }}>Módulos integrados para producción real.</h1>
            <p style={{ margin: 0, maxWidth: '720px', color: 'rgba(248,245,237,0.78)', fontSize: '18px', lineHeight: 1.6 }}>
              Esta es la entrada pública del sistema. Desde aquí puedes abrir la parrilla, el CRM social, el panel del cliente y el calendario operativo sin caer en una página vacía.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <Link href='/admin/dashboard' style={{ background: '#f4cf63', color: '#0b0b0b', textDecoration: 'none', fontWeight: 800, borderRadius: '999px', padding: '12px 18px' }}>
                Abrir módulos
              </Link>
              <Link href='/cliente' style={{ border: '1px solid rgba(212,175,55,0.25)', color: '#f8f5ed', textDecoration: 'none', fontWeight: 700, borderRadius: '999px', padding: '12px 18px' }}>
                Acceso cliente
              </Link>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '24px', padding: '22px' }}>
            <p style={{ margin: '0 0 14px', color: '#f4cf63', fontWeight: 700 }}>Estado del sistema</p>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              {metrics.map((metric) => (
                <div key={metric.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '16px' }}>
                  <p style={{ margin: 0, color: 'rgba(248,245,237,0.68)', fontSize: '12px' }}>{metric.label}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 800 }}>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '34px' }}>
          <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                style={{
                  textDecoration: 'none',
                  color: '#f8f5ed',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.12)',
                  borderRadius: '22px',
                  padding: '22px',
                  display: 'grid',
                  gap: '12px',
                  minHeight: '190px',
                }}
              >
                <div style={{ width: '14px', height: '14px', borderRadius: '999px', background: module.accent }} />
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '24px' }}>{module.title}</h2>
                  <p style={{ margin: 0, color: 'rgba(248,245,237,0.74)', lineHeight: 1.6 }}>{module.description}</p>
                </div>
                <span style={{ marginTop: 'auto', color: module.accent, fontWeight: 700 }}>Abrir módulo</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}