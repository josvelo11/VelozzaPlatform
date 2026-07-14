import { serviceSchema } from '@/lib/seo/schema';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon, type PremiumIconName } from '@/components/PremiumIcon';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

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
      `https://velozzaworks.com/servicios/${serviceSlug}`
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

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', display: 'grid', placeItems: 'center', marginBottom: '20px', background: 'linear-gradient(135deg, rgba(244,207,99,0.18), rgba(15,23,42,0.06))', border: '1px solid rgba(244,207,99,0.26)' }}>
              <PremiumIcon name={service.icon as PremiumIconName} size={30} />
            </div>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>{service.title}</h1>
            <p style={{ fontSize: '18px', color: '#a7a7a7', lineHeight: '1.6' }}>
              {service.longDescription}
            </p>
          </div>

          {/* Benefits */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Beneficios</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {service.benefits?.map((benefit: string, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#0f0f0f',
                    color: '#f8f5ed',
                    border: '1px solid rgba(244, 207, 99, 0.16)',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ color: '#f4cf63', fontSize: '20px' }}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Packages Section */}
          {(service.packages || relatedService?.packages) && (
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '40px' }}>Nuestros Paquetes</h2>

              {/* Current Service Packages */}
              {service.packages && service.packages.length > 0 && (
                <div style={{ marginBottom: '50px' }}>
                  <h3 style={{ color: '#f8f5ed', fontSize: '20px', marginBottom: '25px', textAlign: 'center' }}>
                    {service.title}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                    {service.packages.map((pkg: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: '30px',
                          backgroundColor: '#0f0f0f',
                          border: index === service.packages.length - 1 ? '2px solid #f4cf63' : '1px solid rgba(244, 207, 99, 0.16)',
                          borderRadius: '12px',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {index === service.packages.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-12px',
                              right: '20px',
                              backgroundColor: '#f4cf63',
                              color: '#0b0b0b',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}
                          >
                            Recomendado
                          </div>
                        )}
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#f8f5ed' }}>{pkg.name}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7', marginBottom: '20px' }}>{pkg.duration}</p>
                        <div style={{ marginBottom: '25px' }}>
                          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f4cf63' }}>
                            ${pkg.price.toLocaleString('es-CO')}
                          </span>
                          <span style={{ color: '#a7a7a7', marginLeft: '8px' }}>{pkg.currency}</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', flex: 1 }}>
                          {pkg.includes.map((item: string, idx: number) => (
                            <li
                              key={idx}
                              style={{
                                display: 'flex',
                                gap: '10px',
                                color: '#c8c6be',
                                fontSize: '13px',
                              }}
                            >
                              <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Service Packages */}
              {relatedService?.packages && relatedService.packages.length > 0 && (
                <div>
                  <h3 style={{ color: '#f8f5ed', fontSize: '20px', marginBottom: '25px', textAlign: 'center' }}>
                    {relatedService.title}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                    {relatedService.packages.map((pkg: any, index: number) => (
                      <div
                        key={`related-${index}`}
                        style={{
                          padding: '30px',
                          backgroundColor: '#0f0f0f',
                          border: pkg.featured ? '2px solid #f4cf63' : '1px solid rgba(244, 207, 99, 0.16)',
                          borderRadius: '12px',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {pkg.featured && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-12px',
                              right: '20px',
                              backgroundColor: '#f4cf63',
                              color: '#0b0b0b',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}
                          >
                            Plan Básico
                          </div>
                        )}
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#f8f5ed' }}>{pkg.name}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7', marginBottom: '5px' }}>{pkg.duration}</p>
                        {pkg.billing && (
                          <p style={{ fontSize: '11px', color: '#a7a7a7', marginBottom: '20px', fontStyle: 'italic' }}>
                            {pkg.billing}
                          </p>
                        )}
                        <div style={{ marginBottom: '25px' }}>
                          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f4cf63' }}>
                            ${pkg.price.toLocaleString('es-CO')}
                          </span>
                          <span style={{ color: '#a7a7a7', marginLeft: '8px' }}>
                            {pkg.billing ? '' : pkg.currency}
                          </span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', flex: 1 }}>
                          {pkg.includes.map((item: string, idx: number) => (
                            <li
                              key={idx}
                              style={{
                                display: 'flex',
                                gap: '10px',
                                color: '#c8c6be',
                                fontSize: '13px',
                              }}
                            >
                              <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
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
          <section
            style={{
              backgroundColor: '#0f0f0f',
              color: '#f8f5ed',
              border: '1px solid rgba(244, 207, 99, 0.18)',
              padding: '40px',
              borderRadius: '12px',
              marginBottom: '60px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>¿Listo para comenzar?</h2>
            <button
              style={{
                padding: '12px 30px',
                backgroundColor: '#f4cf63',
                color: '#0b0b0b',
                border: '1px solid rgba(244, 207, 99, 0.2)',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Agendar Consultoría
            </button>
          </section>
        </div>

        <FAQ
          items={[
            {
              question: `¿Cómo funciona ${service.title}?`,
              answer: `Comenzamos con análisis, definimos estrategia personalizada, y ejecutamos con reportes mensuales.`,
            },
            {
              question: '¿Cuánto tiempo tarda?',
              answer: 'Depende del servicio, pero típicamente ves resultados en 2-6 meses.',
            },
          ]}
        />
      </main>
    </>
  );
  } catch {
    notFound();
  }
}
