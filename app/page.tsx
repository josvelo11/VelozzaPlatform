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
    title: 'Personal Branding & Legacy',
    icon: '👤',
    description: 'Transformamos expertos en íconos de su industria. Arquitectura de persuasión e identidad visual minimalista para atraer clientes high-ticket y convertir tu nombre en un activo de alto valor que trabaja solo.',
    href: '/servicios/personal-branding',
  },
  {
    title: 'Social Media Management',
    icon: '📱',
    description: 'Ecosistemas de conversión, no de vanidad. Embudos de contenido estratégico con gatillos psicológicos que capturan atención, educan a tu audiencia y transforman el tráfico frío en comunidad leal y rentable.',
    href: '/servicios/social-media-management',
  },
  {
    title: 'Posicionamiento SEO',
    icon: '🔎',
    description: 'Construimos bienes raíces digitales. Mientras tu competencia paga por visibilidad efímera, estructuramos tu autoridad orgánica para que seas la única opción lógica cuando tu cliente ideal esté listo para comprar.',
    href: '/servicios/seo-services',
  },
  {
    title: 'Video Marketing & Cinematografía',
    icon: '🎥',
    description: 'No grabamos videos, producimos activos digitales. Iluminación de alto contraste, color grading cinematográfico y dirección de arte para crear piezas que paralizan el scroll y fuerzan la retención.',
    href: '/servicios/video-marketing',
  },
  {
    title: 'Fotografía Corporativa',
    icon: '📷',
    description: 'Retratos de autoridad para perfiles C-Level y equipos ejecutivos. Tu imagen debe proyectar el mismo nivel de excelencia que tu empresa. Dominamos la luz y la dirección de arte para transmitir poder, confianza y exclusividad.',
    href: '/servicios',
  },
  {
    title: 'Eventos Sociales Élite',
    icon: '⭐',
    description: 'Cobertura documental y cinematográfica para galas corporativas, lanzamientos de alto perfil y celebraciones privadas. Discreción absoluta y una estética visual inmaculada que preserva el legado de cada evento.',
    href: '/servicios',
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
            <div className="americas-map-bg" aria-hidden="true">
              <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
                <g className="americas-land">
                  <path d="M181 118l38 20 9 27 31 14 23 40 35 10 16 18-8 16-34 8-23 20-2 17 17 24-16 19-34-1-17 9 6 22-21 10-24-2-8 18-19 11-16-10-11-22-30-16-6-30 18-15-5-17 12-16 24-7 17-20 15-5 6-29 17-9z" />
                  <path d="M451 333l29 8 28 26 30 8 10 22 34 19 9 17-9 17-27 8-26-5-26 14-8 25 6 24-11 15-23 2-17-16-13-32-19-13-8-28-18-18-12-34 12-25 19-9z" />
                  <path d="M557 489l27 5 15 20 16 7 6 19-13 22 3 21-16 31 9 20-19 28-16 49-19 13-20-24-11-34 5-24-14-31 4-26 18-20 2-18 14-27 9-31z" />
                </g>

                <g className="americas-grid">
                  <path d="M80 600h1040" />
                  <path d="M80 500h1040" />
                  <path d="M80 400h1040" />
                  <path d="M80 300h1040" />
                  <path d="M80 200h1040" />
                </g>

                <g>
                  <g className="ops-dot ops-dot-main" transform="translate(525,470)">
                    <circle r="9" />
                    <circle className="ops-pulse" r="9" />
                  </g>
                  <text x="545" y="475" className="ops-label">Colombia HQ</text>

                  <g className="ops-dot" transform="translate(494,376)"><circle r="7" /></g>
                  <text x="512" y="381" className="ops-label">US Hispanic</text>

                  <g className="ops-dot" transform="translate(395,383)"><circle r="7" /></g>
                  <text x="413" y="388" className="ops-label">México</text>

                  <g className="ops-dot" transform="translate(497,451)"><circle r="7" /></g>
                  <text x="515" y="456" className="ops-label">Centroamérica</text>

                  <g className="ops-dot" transform="translate(548,536)"><circle r="7" /></g>
                  <text x="566" y="541" className="ops-label">Perú</text>

                  <g className="ops-dot" transform="translate(590,617)"><circle r="7" /></g>
                  <text x="608" y="622" className="ops-label">Chile</text>

                  <g className="ops-dot" transform="translate(649,650)"><circle r="7" /></g>
                  <text x="667" y="655" className="ops-label">Argentina</text>
                </g>
              </svg>
            </div>
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
          <h2 className="section-title">Ecosistemas de Crecimiento</h2>
          <p className="section-lead muted">
            No vendemos servicios aislados. Cada solución forma parte de un sistema integrado de posicionamiento, visibilidad y conversión diseñado para marcas que operan en la categoría premium.
          </p>
          <div className="feature-grid">
            {services.map((service) => (
              <Link key={service.title} href={service.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="feature-card" style={{ minHeight: '220px', cursor: 'pointer' }}>
                  <div className="feature-icon">{service.icon}</div>
                  <h3 style={{ margin: '0 0 10px' }}>{service.title}</h3>
                  <p style={{ margin: 0 }}>{service.description}</p>
                  <div style={{ marginTop: '18px', color: 'var(--accent-strong)', fontWeight: 700, fontSize: '0.9rem' }}>Ver detalle →</div>
                </article>
              </Link>
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
                ¿Listo para Escalar tu Percepción de Marca?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Agenda una sesión estratégica de 30 minutos y construyamos juntos el mapa exacto para posicionarte como el referente absoluto de tu sector. Sin plantillas genéricas, sin paquetes predefinidos: arquitectura de marca a medida.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '8px' }}>
                <button className="cta-primary">Agendar Consultoría Privada</button>
                <Link href="/casos-de-exito" className="cta-secondary">
                  Ver Resultados Reales
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <h2 className="section-title">La Bóveda de Inteligencia</h2>
          <p className="section-lead muted">
            Tácticas de retención, neuromarketing y análisis de algoritmos. Las estrategias exactas que aplicamos con nuestros clientes de élite.
          </p>
          <div style={{ display: 'grid', gap: '22px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '36px' }}>
            {[
              {
                badge: 'Neuromarketing',
                title: 'El Lujo Silencioso en el Diseño Digital: Cómo Vender High-Ticket Sin Levantar la Voz.',
                excerpt: 'En un mercado saturado de ruido, el espacio negativo y el contraste son el nuevo lujo. Las paletas sobrias y la tipografía estructurada elevan subconscientemente el precio que tus clientes están dispuestos a pagar.',
                date: 'Junio 2025',
                readTime: '8 min de lectura',
                href: '/blog/personal-branding-2025',
              },
              {
                badge: 'Cinematografía',
                title: 'La Psicología de la Luz: Por Qué tu Video 4K No Está Convirtiendo.',
                excerpt: 'Una cámara costosa no genera deseo; el contraste sí. El uso estratégico de luces bi-color, direccionalidad de sombras y color grading separan un video corporativo aburrido de un activo digital que vende.',
                date: 'Mayo 2025',
                readTime: '6 min de lectura',
                href: '/blog/seo-tendencias-2025',
              },
              {
                badge: 'Estrategia SEO',
                title: 'Sobreviviendo al Algoritmo: La Arquitectura de un Dominio Inquebrantable.',
                excerpt: 'Las redes sociales alquilan tu audiencia, el SEO la hace tuya. Guía para estructurar tu sitio como un ecosistema de autoridad que captura demanda orgánica mes a mes sin depender de pauta.',
                date: 'Abril 2025',
                readTime: '10 min de lectura',
                href: '/blog/seo-tendencias-2025',
              },
            ].map((art) => (
              <Link key={art.title} href={art.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="feature-card" style={{ minHeight: '260px', cursor: 'pointer' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.22)', color: '#f4cf63', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>{art.badge}</span>
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem', lineHeight: '1.4' }}>{art.title}</h3>
                  <p style={{ margin: '0 0 16px', fontSize: '0.93rem' }}>{art.excerpt}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--text-soft)', marginBottom: '16px' }}>
                    <span>{art.date}</span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <div style={{ color: 'var(--accent-strong)', fontWeight: 700, fontSize: '0.9rem' }}>Leer Análisis Completo →</div>
                </article>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/blog" className="cta-primary">
              Acceder a La Bóveda
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
