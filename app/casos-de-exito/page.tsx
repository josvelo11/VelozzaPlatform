import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { PremiumIcon } from '@/components/PremiumIcon';
import { getAllCaseStudies } from '@/lib/case-studies';

export const revalidate = 60;

const methodology = [
  {
    icon: 'search' as const,
    title: 'Datos verificables',
    copy: 'Cada cifra publicada viene de la plataforma real del cliente: analítica, CRM o reportes de campaña. Nada de proyecciones ni promedios de industria.',
  },
  {
    icon: 'target' as const,
    title: 'Documentado caso por caso',
    copy: 'No mezclamos resultados de distintos clientes en una sola cifra genérica. Cada caso se publica con su propio contexto, reto y estrategia.',
  },
  {
    icon: 'analytics' as const,
    title: 'Sin cifras genéricas',
    copy: 'Si un canal no convierte por clic sino por llamada o WhatsApp, medimos y reportamos así — no forzamos el dato a una métrica que no aplica.',
  },
];

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();

  return (
    <main>
      <Breadcrumb
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Casos de Éxito' },
        ]}
      />

      <section className="section-shell">
        <div
          className="hero-shell"
          style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.98), rgba(8,8,8,0.98))' }}
        >
          <div className="hero-grid" style={{ gridTemplateColumns: '1fr', justifyItems: 'center', textAlign: 'center' }}>
            <div style={{ maxWidth: '820px' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Resultados verificables</div>
              <h1 className="hero-title" style={{ maxWidth: '16ch', marginLeft: 'auto', marginRight: 'auto' }}>
                Casos de <span className="text-shimmer">éxito</span>, no promesas
              </h1>
              <p className="hero-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                Resultados reales, documentados caso por caso, con datos verificables — sin cifras genéricas. Vamos publicando cada caso a medida que lo cerramos con nuestros clientes.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <a
                  className="cta-primary magnetic"
                  href="https://api.whatsapp.com/send?phone=573053090273&text=Hola%20Velozza%2C%20quiero%20ver%20resultados%20para%20mi%20industria."
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero resultados así
                </a>
                <Link href="/servicios" className="cta-secondary">
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '64px' }}>
          <div className="reveal" style={{ marginBottom: '32px' }}>
            <div className="eyebrow">Portafolio de casos</div>
            <h2 className="section-title" style={{ marginBottom: '8px', color: '#f4cf63' }}>
              {studies.length} {studies.length === 1 ? 'caso publicado' : 'casos publicados'}
            </h2>
            <p className="muted" style={{ maxWidth: '68ch' }}>
              Cada tarjeta resume el reto, la industria y una muestra de los resultados documentados. Entra al caso completo para ver estrategia, resultados y testimonio.
            </p>
          </div>

          <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            {studies.map((study, i) => (
              <Link
                key={study.slug}
                href={`/casos-de-exito/${study.slug}`}
                className="premium-card tilt reveal case-card"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="case-card-industry">{study.industry}</span>
                <h3 className="case-card-title">{study.title}</h3>
                <p className="case-card-challenge">{study.challenge}</p>

                {study.results?.length > 0 && (
                  <ul className="case-card-results">
                    {study.results.slice(0, 2).map((result) => (
                      <li key={result}>
                        <PremiumIcon name="check" size={15} />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {study.services?.length > 0 && (
                  <div className="chip-row" style={{ marginTop: '18px' }}>
                    {study.services.map((service) => (
                      <span key={service} className="chip case-chip">{service}</span>
                    ))}
                  </div>
                )}

                <span className="case-card-cta">
                  Ver caso completo
                  <PremiumIcon name="arrow-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <section style={{ marginTop: '96px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="eyebrow" style={{ display: 'inline-flex' }}>Metodología</div>
            <h2 className="section-title" style={{ color: '#f4cf63' }}>Así documentamos cada resultado</h2>
          </div>
          <div className="feature-grid">
            {methodology.map((item, i) => (
              <div key={item.title} className="feature-card tilt reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">
                  <PremiumIcon name={item.icon} size={22} />
                </div>
                <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.25rem' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#c8c6be', lineHeight: 1.7 }}>{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '96px', marginBottom: '32px' }}>
          <div className="panel panel-pad service-cta" style={{ textAlign: 'center' }}>
            <h2 className="section-title" style={{ marginBottom: '12px', color: '#f4cf63' }}>
              Tu marca puede ser el próximo caso publicado
            </h2>
            <p className="muted" style={{ margin: '0 auto', maxWidth: '640px' }}>
              Agenda una consultoría estratégica gratuita y descubre qué resultados son realistas para tu industria y tu etapa actual.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <Link href="/contacto" className="cta-primary">
                Agendar Ahora
              </Link>
              <Link href="/industrias" className="cta-secondary">
                Ver Industrias que Atendemos
              </Link>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        .case-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        .case-card-industry {
          display: inline-flex;
          align-self: flex-start;
          color: #f4cf63;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }

        .case-card-title {
          margin: 0 0 12px;
          font-family: Cormorant Garamond, serif;
          font-size: 1.5rem;
          line-height: 1.15;
          color: #f8f5ed;
        }

        .case-card-challenge {
          margin: 0 0 16px;
          color: #c8c6be;
          line-height: 1.7;
        }

        .case-card-results {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .case-card-results li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #efe9d6;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .case-card-results svg {
          color: #f4cf63;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .case-chip {
          font-size: 0.78rem;
          padding: 6px 12px;
        }

        .case-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          color: #f4cf63;
          font-weight: 700;
          transition: gap 200ms ease;
        }

        .case-card:hover .case-card-cta {
          gap: 12px;
        }

        @media (max-width: 640px) {
          .case-card-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </main>
  );
}
