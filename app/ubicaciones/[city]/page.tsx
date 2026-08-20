import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { localBusinessSchema } from '@/lib/seo/schema';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return ['bogota', 'medellin'].map((city) => ({ city }));
}

export default async function LocationPage({ params }: Props) {
  try {
    const { city } = await params;
    const filePath = path.join(process.cwd(), `content/locations/${city}.json`);
    const content = fs.readFileSync(filePath, 'utf8');
    const location = JSON.parse(content);

    const schema = localBusinessSchema(
      location.city,
      location.address,
      location.phone
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
            { name: 'Ubicaciones', href: '/ubicaciones' },
            { name: location.city },
          ]}
        />

        <div className="section-shell" style={{ maxWidth: '800px' }}>
          <h1 className="reveal" style={{ fontSize: '36px', marginBottom: '20px' }}>
            {location.city}, {location.region}
          </h1>

          <div
            className="tilt reveal"
            style={{
              backgroundColor: '#0f0f0f',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
              border: '1px solid rgba(244, 207, 99, 0.16)',
              color: '#f8f5ed',
            }}
          >
            <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
              {location.description}
            </p>

            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <h3>Dirección</h3>
                <p>{location.address}</p>
                <p>{location.city}, {location.region}, {location.country}</p>
              </div>

              <div>
                <h3>Contacto</h3>
                <p>
                  Teléfono:{' '}
                  <a href={`tel:${location.phone}`} style={{ color: '#f4cf63' }}>
                    {location.phone}
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href={`mailto:${location.email}`} style={{ color: '#f4cf63' }}>
                    {location.email}
                  </a>
                </p>
              </div>

              <a
                href="/contacto"
                className="shine-hover"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#f4cf63',
                  color: '#0b0b0b',
                  border: '1px solid rgba(244, 207, 99, 0.2)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  width: 'fit-content',
                }}
              >
                Agendar Consultoría
              </a>
            </div>
          </div>

          {location.intro && (
            <section style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '26px', marginBottom: '16px' }}>
                Marketing digital en {location.city}
              </h2>
              {location.intro.map((paragraph: string) => (
                <p key={paragraph} style={{ fontSize: '17px', lineHeight: '1.7', marginBottom: '16px' }}>
                  {paragraph}
                </p>
              ))}
            </section>
          )}

          {location.servicesHighlight && (
            <section style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '26px', marginBottom: '16px' }}>
                Servicios clave en {location.city}
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'grid', gap: '10px' }}>
                {location.servicesHighlight.map((service: string) => (
                  <li key={service} style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    {service}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {location.faqs && (
            <section style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '26px', marginBottom: '16px' }}>
                Preguntas frecuentes en {location.city}
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {location.faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <div
                    key={faq.question}
                    className="tilt reveal"
                    style={{
                      backgroundColor: '#0f0f0f',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(244, 207, 99, 0.16)',
                      color: '#f8f5ed',
                      transitionDelay: `${i * 0.08}s`,
                    }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#f4cf63' }}>
                      {faq.question}
                    </h3>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
  } catch {
    notFound();
  }
}
