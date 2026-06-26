import { serviceSchema } from '@/lib/seo/schema';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { PremiumIcon, type PremiumIconName } from '@/components/PremiumIcon';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ service: string }>;
}

export function generateStaticParams() {
  return ['personal-branding', 'social-media-management', 'seo-services', 'video-marketing'].map(
    (service) => ({ service })
  );
}

export default async function ServicePage({ params }: Props) {
  try {
    const { service: serviceSlug } = await params;
    const filePath = path.join(process.cwd(), `content/services/${serviceSlug}.json`);
    const content = fs.readFileSync(filePath, 'utf8');
    const service = JSON.parse(content);

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
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ color: '#f4cf63', fontSize: '20px' }}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            style={{
              backgroundColor: '#f4cf63',
              color: 'white',
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
                backgroundColor: 'white',
                color: '#f4cf63',
                border: 'none',
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
