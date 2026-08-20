import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { PremiumIcon } from '@/components/PremiumIcon';
import { localBusinessSchema } from '@/lib/seo/schema';

export const revalidate = 60;
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

        <section className="section-shell" style={{ paddingBottom: 0 }}>
          <div
            className="hero-shell"
            style={{ background: 'linear-gradient(180deg, rgba(12,12,10,0.98), rgba(8,8,8,0.98))' }}
          >
            <div className="hero-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div style={{ maxWidth: '760px' }}>
                <div className="eyebrow">Ubicación Velozza</div>
                <h1 className="hero-title" style={{ maxWidth: '16ch', fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                  {location.city}, {location.region}
                </h1>
                <p className="hero-copy">{location.description}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-shell" style={{ maxWidth: '900px' }}>
          <div className="location-info-grid reveal">
            <div className="location-info-tile">
              <div className="location-info-icon"><PremiumIcon name="target" size={20} /></div>
              <h3>Dirección</h3>
              <p>{location.address}</p>
              <p>{location.city}, {location.region}, {location.country}</p>
            </div>

            <div className="location-info-tile">
              <div className="location-info-icon"><PremiumIcon name="chat" size={20} /></div>
              <h3>Contacto</h3>
              <p>
                Teléfono:{' '}
                <a href={`tel:${location.phone}`} className="location-info-link">
                  {location.phone}
                </a>
              </p>
              <p>
                Email:{' '}
                <a href={`mailto:${location.email}`} className="location-info-link">
                  {location.email}
                </a>
              </p>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: '32px', textAlign: 'center' }}>
            <a href="/contacto" className="cta-primary magnetic">
              Agendar Consultoría
            </a>
          </div>

          {location.intro && (
            <section className="reveal detail-section">
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>
                Marketing digital en {location.city}
              </h2>
              {location.intro.map((paragraph: string) => (
                <p key={paragraph} className="location-copy">
                  {paragraph}
                </p>
              ))}
            </section>
          )}

          {location.servicesHighlight && (
            <section className="reveal detail-section">
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>
                Servicios clave en {location.city}
              </h2>
              <ul className="location-services-list">
                {location.servicesHighlight.map((service: string) => (
                  <li key={service}>
                    <PremiumIcon name="check" size={17} />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {location.faqs && (
            <section className="reveal detail-section" style={{ marginBottom: '48px' }}>
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>
                Preguntas frecuentes en {location.city}
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {location.faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <div
                    key={faq.question}
                    className="tilt reveal premium-card location-faq-card"
                    style={{ transitionDelay: `${i * 0.08}s` }}
                  >
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <style>{`
        .location-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .location-info-tile {
          padding: 28px;
          background: rgba(18, 18, 18, 0.92);
          border: 1px solid var(--line);
          border-radius: 20px;
        }

        .location-info-icon {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          background: rgba(244, 207, 99, 0.10);
          border: 1px solid rgba(244, 207, 99, 0.18);
          color: #f4cf63;
          margin-bottom: 16px;
        }

        .location-info-tile h3 {
          margin: 0 0 12px;
          font-family: Cormorant Garamond, serif;
          color: #f8f5ed;
          font-size: 1.15rem;
        }

        .location-info-tile p {
          margin: 0 0 4px;
          color: #c8c6be;
          line-height: 1.6;
        }

        .location-info-link {
          color: #f4cf63;
          text-decoration: none;
          font-weight: 600;
          transition: color 200ms ease;
        }

        .location-info-link:hover {
          color: #fff2c9;
        }

        .detail-section {
          margin-top: 64px;
        }

        .location-copy {
          font-size: 1rem;
          line-height: 1.75;
          color: #c8c6be;
          margin: 0 0 16px;
        }

        .location-services-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .location-services-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #c8c6be;
          font-size: 1rem;
          line-height: 1.6;
        }

        .location-services-list svg {
          color: #f4cf63;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .location-faq-card {
          padding: 24px;
          background: rgba(18, 18, 18, 0.92);
          border: 1px solid var(--line);
          border-radius: 18px;
        }

        .location-faq-card h3 {
          margin: 0 0 10px;
          color: #f4cf63;
          font-size: 1.05rem;
        }

        .location-faq-card p {
          margin: 0;
          color: #c8c6be;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .location-info-grid {
            grid-template-columns: 1fr;
          }

          .detail-section {
            margin-top: 44px;
          }
        }
      `}</style>
    </>
  );
  } catch {
    notFound();
  }
}
