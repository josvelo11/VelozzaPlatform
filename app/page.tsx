import Link from 'next/link';
import { Metadata } from 'next';
import { organizationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Velozza Creative Works | Marketing Digital y Personal Branding',
  description:
    'Agencia de marketing digital especializada en SEO, personal branding, social media management y estrategia de crecimiento empresarial en Latinoamérica.',
  keywords: [
    'marketing digital',
    'SEO',
    'personal branding',
    'social media management',
    'agencia digital',
  ],
  openGraph: {
    title: 'Velozza Creative Works',
    description:
      'Posicionate como autoridad en tu industria con estrategias de marketing digital probadas',
    type: 'website',
    locale: 'es_CO',
  },
};

const schema = organizationSchema();

const services = [
  {
    title: 'Personal Branding',
    icon: '👤',
    description: 'Construye autoridad en tu industria',
  },
  {
    title: 'Social Media',
    icon: '📱',
    description: 'Crecimiento y engagement garantizado',
  },
  {
    title: 'SEO Services',
    icon: '🔎',
    description: 'Posicionamiento en Google',
  },
  {
    title: 'Video Marketing',
    icon: '🎥',
    description: 'Contenido viral y conversión',
  },
];

const stats = [
  { value: '500+', label: 'Empresas Transformadas' },
  { value: '8', label: 'Años de experiencia' },
  { value: '4', label: 'Mercados atendidos' },
  { value: '$50M+', label: 'Generados para clientes' },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main>
        <section className="section-shell">
          <div className="hero-shell">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">Velozza Creative Works</div>
                <h1 className="hero-title">Posicionate como Autoridad en tu Industria</h1>
                <p className="hero-copy">
                  Marketing digital, personal branding, SEO y sistemas de crecimiento para emprendedores y empresas que quieren verse y vender como una marca premium.
                </p>
                <div className="hero-actions">
                  <button className="cta-primary">Iniciar Consultoría Gratuita</button>
                  <Link href="/servicios" className="cta-secondary">
                    Ver Servicios
                  </Link>
                </div>
                <div className="chip-row" style={{ marginTop: '24px' }}>
                  <span className="chip">Colombia</span>
                  <span className="chip">Latam</span>
                  <span className="chip">US Hispanic</span>
                  <span className="chip">España</span>
                </div>
              </div>

              <div className="panel panel-pad">
                <div className="stat-grid">
                  {stats.map((item) => (
                    <div key={item.label} className="stat-card">
                      <div className="stat-value">{item.value}</div>
                      <div className="stat-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-lead muted">
            Un sistema completo de crecimiento con branding, adquisición orgánica, contenido y conversión.
          </p>
          <div className="feature-grid">
            {services.map((service) => (
              <article key={service.title} className="feature-card">
                <div className="feature-icon">{service.icon}</div>
                <h3 style={{ margin: '0 0 10px' }}>{service.title}</h3>
                <p style={{ margin: 0 }}>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div
            className="panel panel-pad"
            style={{
              background: 'linear-gradient(135deg, rgba(8,47,73,0.98), rgba(15,23,42,0.94))',
              color: 'white',
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: '18px',
                maxWidth: '780px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <h2 className="section-title" style={{ color: 'white', marginBottom: 0 }}>
                ¿Listo para Crecer?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Agenda tu consultoría gratuita y revisamos cómo tu marca debe verse, posicionarse y convertir.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '8px' }}>
                <button className="cta-primary">Agendar Consultoría</button>
                <Link href="/casos-de-exito" className="cta-secondary">
                  Ver Casos de Éxito
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <h2 className="section-title">Últimos Artículos del Blog</h2>
          <p className="section-lead muted">
            Ideas, estrategia y posicionamiento para crecer en búsqueda orgánica y autoridad de marca.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link href="/blog" className="cta-primary">
              Leer blog completo
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
