import { serviceSchema } from '@/lib/seo/schema';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon, type PremiumIconName } from '@/components/PremiumIcon';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

interface Props {
  params: Promise<{ service: string }>;
}

export function generateStaticParams() {
  return [
    'personal-branding',
    'social-media-management',
    'seo-services',
    'video-marketing',
    'publicidad-digital',
    'automatizacion-ia',
    'fotografia-corporativa',
    'eventos-sociales-elite',
  ].map(
    (service) => ({ service })
  );
}

export default async function ServicePage({ params }: Props) {
  try {
    const { service: serviceSlug } = await params;
    const filePath = path.join(process.cwd(), `content/services/${serviceSlug}.json`);
    const content = fs.readFileSync(filePath, 'utf8');
    const service = JSON.parse(content);

    // Load related service packages if available
    let relatedService = null;
    if (serviceSlug === 'personal-branding') {
      try {
        const relatedPath = path.join(process.cwd(), 'content/services/social-media-management.json');
        const relatedContent = fs.readFileSync(relatedPath, 'utf8');
        relatedService = JSON.parse(relatedContent);
      } catch {
        // Related service not found
      }
    }

    const schema = serviceSchema(
      service.title,
      service.longDescription,
      '/service-image.jpg',
      `https://velozzacws.com/servicios/${serviceSlug}`
    );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Servicios', href: '/servicios' },
            { name: service.title },
          ]}
        />

        <section className="section-shell" style={{ paddingBottom: 0 }}>
          <div
            className="hero-shell"
            style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.98), rgba(8,8,8,0.98))' }}
          >
            <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div style={{ maxWidth: '760px' }}>
                <div className="service-detail-icon">
                  <PremiumIcon name={service.icon as PremiumIconName} size={28} />
                </div>
                <div className="eyebrow">Servicio Velozza</div>
                <h1 className="hero-title" style={{ maxWidth: '18ch', fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                  {service.title}
                </h1>
                <p className="hero-copy">{service.longDescription}</p>
                <div className="hero-actions">
                  <a href="/contacto" className="cta-primary magnetic">
                    Agendar Consultoría
                  </a>
                  <Link href="/servicios" className="cta-secondary">
                    Ver todos los servicios
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-shell" style={{ maxWidth: '1000px' }}>
          {service.extendedDescription?.length > 0 && (
            <div className="reveal detail-copy-block">
              {service.extendedDescription.map((para: string, index: number) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          )}

          {/* Benefits */}
          <section className="detail-section">
            <div className="detail-heading reveal">
              <div className="eyebrow">Beneficios</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>Lo que este servicio construye para ti</h2>
            </div>
            <div className="feature-grid">
              {service.benefits?.map((benefit: string, index: number) => (
                <div key={index} className="feature-card tilt reveal" style={{ transitionDelay: `${(index % 6) * 0.06}s` }}>
                  <div className="feature-icon">
                    <PremiumIcon name="check" size={20} />
                  </div>
                  <p style={{ margin: 0, color: '#f8f5ed', lineHeight: 1.6 }}>{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Para quién es (opcional, aditivo) */}
          {service.audience && service.audience.length > 0 && (
            <section className="detail-section">
              <div className="detail-heading reveal">
                <div className="eyebrow">A quién ayuda</div>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>¿Para quién es este servicio?</h2>
              </div>
              <div className="audience-grid">
                {service.audience.map((item: string, index: number) => (
                  <div key={index} className="audience-item tilt reveal" style={{ transitionDelay: `${(index % 6) * 0.06}s` }}>
                    <PremiumIcon name="arrow-right" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Proceso de trabajo (opcional, aditivo) */}
          {service.process && service.process.length > 0 && (
            <section className="detail-section">
              <div className="detail-heading reveal">
                <div className="eyebrow">Metodología</div>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>Nuestro proceso</h2>
              </div>
              <div className="detail-process-grid">
                {service.process.map((step: { title: string; description: string }, index: number) => (
                  <div key={index} className="detail-process-card tilt reveal premium-card" style={{ transitionDelay: `${(index % 6) * 0.08}s` }}>
                    <span className="detail-process-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Entregables (opcional, aditivo) */}
          {service.deliverables && service.deliverables.length > 0 && (
            <section className="detail-section">
              <div className="detail-heading reveal">
                <div className="eyebrow">Entregables</div>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>Qué recibes</h2>
              </div>
              <div className="audience-grid">
                {service.deliverables.map((item: string, index: number) => (
                  <div key={index} className="audience-item tilt reveal" style={{ transitionDelay: `${(index % 6) * 0.06}s` }}>
                    <PremiumIcon name="check" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Packages Section */}
          {(service.packages || relatedService?.packages) && (
            <section className="detail-section">
              <div className="detail-heading reveal" style={{ textAlign: 'center' }}>
                <div className="eyebrow" style={{ display: 'inline-flex' }}>Tarifas</div>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#f4cf63' }}>Nuestros Paquetes</h2>
              </div>

              {/* Current Service Packages */}
              {service.packages && service.packages.length > 0 && (
                <div style={{ marginBottom: '48px' }}>
                  <h3 className="package-group-title">{service.title}</h3>
                  <div className="detail-package-grid">
                    {service.packages.map((pkg: any, index: number) => {
                      const featured = index === service.packages.length - 1;
                      return (
                        <div key={index} className={`detail-package-card tilt reveal premium-card${featured ? ' featured' : ''}`} style={{ transitionDelay: `${index * 0.08}s` }}>
                          {featured && <div className="detail-package-badge">Recomendado</div>}
                          <h4>{pkg.name}</h4>
                          <p className="detail-package-duration">{pkg.duration}</p>
                          <div className="detail-package-price">
                            <span>${pkg.price.toLocaleString('es-CO')}</span>
                            <span className="detail-package-currency">{pkg.currency}</span>
                          </div>
                          <ul className="detail-package-list">
                            {pkg.includes.map((item: string, idx: number) => (
                              <li key={idx}>
                                <PremiumIcon name="check" size={15} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related Service Packages */}
              {relatedService?.packages && relatedService.packages.length > 0 && (
                <div>
                  <h3 className="package-group-title">{relatedService.title}</h3>
                  <div className="detail-package-grid">
                    {relatedService.packages.map((pkg: any, index: number) => (
                      <div key={`related-${index}`} className={`detail-package-card tilt reveal premium-card${pkg.featured ? ' featured' : ''}`} style={{ transitionDelay: `${index * 0.08}s` }}>
                        {pkg.featured && <div className="detail-package-badge">Plan Básico</div>}
                        <h4>{pkg.name}</h4>
                        <p className="detail-package-duration">{pkg.duration}</p>
                        {pkg.billing && <p className="detail-package-billing">{pkg.billing}</p>}
                        <div className="detail-package-price">
                          <span>${pkg.price.toLocaleString('es-CO')}</span>
                          <span className="detail-package-currency">{pkg.billing ? '' : pkg.currency}</span>
                        </div>
                        <ul className="detail-package-list">
                          {pkg.includes.map((item: string, idx: number) => (
                            <li key={idx}>
                              <PremiumIcon name="check" size={15} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* CTA */}
          <section className="panel panel-pad reveal detail-cta">
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: '#f4cf63', marginBottom: '12px' }}>
              ¿Listo para comenzar?
            </h2>
            <p className="muted" style={{ margin: '0 auto 24px', maxWidth: '520px' }}>
              Agenda una consultoría estratégica gratuita y descubramos juntos cómo llevar {service.title.toLowerCase()} a tu marca.
            </p>
            <a href="/contacto" className="cta-primary magnetic">
              Agendar Consultoría
            </a>
          </section>
        </div>

        <FAQ
          items={
            service.faqs && service.faqs.length > 0
              ? service.faqs
              : [
                  {
                    question: `¿Cómo funciona ${service.title}?`,
                    answer: `Comenzamos con análisis, definimos estrategia personalizada, y ejecutamos con reportes mensuales.`,
                  },
                  {
                    question: '¿Cuánto tiempo tarda?',
                    answer: 'Depende del servicio, pero típicamente ves resultados en 2-6 meses.',
                  },
                ]
          }
        />
      </main>

      <style>{`
        .service-detail-icon {
          display: inline-flex;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: linear-gradient(135deg, rgba(244, 207, 99, 0.18), rgba(212, 175, 55, 0.08));
          border: 1px solid rgba(244, 207, 99, 0.24);
          color: #f4cf63;
        }

        .detail-copy-block {
          margin: 40px 0 0;
          display: grid;
          gap: 16px;
        }

        .detail-copy-block p {
          margin: 0;
          font-size: 1.02rem;
          line-height: 1.8;
          color: #c8c6be;
        }

        .detail-section {
          margin-top: 80px;
        }

        .detail-heading {
          margin-bottom: 24px;
        }

        .detail-heading .section-title {
          margin: 8px 0 0;
        }

        .audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .audience-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 20px;
          background: rgba(18, 18, 18, 0.92);
          border: 1px solid var(--line);
          border-radius: 16px;
          color: #c8c6be;
          font-size: 0.96rem;
          line-height: 1.6;
        }

        .audience-item svg {
          color: #f4cf63;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .detail-process-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .detail-process-card {
          position: relative;
          padding: 28px 24px 24px;
          background: rgba(18, 18, 18, 0.92);
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
        }

        .detail-process-number {
          position: absolute;
          top: -8px;
          right: 12px;
          font-family: Cormorant Garamond, serif;
          font-size: 4.5rem;
          line-height: 1;
          color: rgba(244, 207, 99, 0.10);
          pointer-events: none;
        }

        .detail-process-card h3 {
          position: relative;
          margin: 0 0 8px;
          font-family: Cormorant Garamond, serif;
          font-size: 1.25rem;
          color: #f8f5ed;
        }

        .detail-process-card p {
          position: relative;
          margin: 0;
          color: #c9c9c9;
          line-height: 1.6;
        }

        .package-group-title {
          color: #f8f5ed;
          font-size: 1.25rem;
          margin-bottom: 24px;
          text-align: center;
        }

        .detail-package-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .detail-package-card {
          padding: 32px;
          background-color: #0f0f0f;
          border: 1px solid rgba(244, 207, 99, 0.16);
          border-radius: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .detail-package-card.featured {
          border: 2px solid #f4cf63;
        }

        .detail-package-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background-color: #f4cf63;
          color: #0b0b0b;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .detail-package-card h4 {
          font-size: 18px;
          margin-bottom: 8px;
          color: #f8f5ed;
        }

        .detail-package-duration {
          font-size: 12px;
          color: #c9c9c9;
          margin-bottom: 20px;
        }

        .detail-package-billing {
          font-size: 11px;
          color: #c9c9c9;
          margin-bottom: 20px;
          font-style: italic;
          margin-top: -14px;
        }

        .detail-package-price {
          margin-bottom: 24px;
          font-size: 32px;
          font-weight: bold;
          color: #f4cf63;
        }

        .detail-package-currency {
          color: #c9c9c9;
          margin-left: 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .detail-package-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
          flex: 1;
        }

        .detail-package-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #c8c6be;
          font-size: 13px;
          line-height: 1.6;
        }

        .detail-package-list svg {
          color: #f4cf63;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .detail-cta {
          margin-top: 80px;
          margin-bottom: 64px;
          text-align: center;
          background: linear-gradient(135deg, rgba(14, 14, 14, 0.98), rgba(6, 6, 6, 0.98));
          border: 1px solid rgba(244, 207, 99, 0.18);
        }

        @media (max-width: 640px) {
          .detail-section {
            margin-top: 56px;
          }

          .detail-package-card {
            padding: 24px;
          }

          .detail-cta {
            margin-top: 56px;
          }
        }
      `}</style>
    </>
  );
  } catch {
    notFound();
  }
}
