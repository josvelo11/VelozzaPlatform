'use client';

import Link from 'next/link';
import { organizationSchema } from '@/lib/seo/schema';
import { PremiumIcon } from '@/components/PremiumIcon';

const cities = [
  { slug: 'bogota', name: 'Bogotá', tag: 'Sede principal' },
  { slug: 'medellin', name: 'Medellín', tag: 'Operación regional' },
];

export default function UbicacionesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />
      <main>
        <section className="section-shell" style={{ maxWidth: '1200px' }}>
          <div className="reveal" style={{ maxWidth: '760px', marginBottom: '48px' }}>
            <div className="eyebrow">Presencia regional</div>
            <h1 className="hero-title" style={{ maxWidth: '16ch' }}>Nuestras Ubicaciones</h1>
            <p className="hero-copy">
              Encuentra a Velozza en las principales ciudades de Colombia y Latinoamérica. Operación híbrida: equipo local con estándar de producción internacional.
            </p>
          </div>

          <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {cities.map((city, i) => (
              <Link
                key={city.slug}
                href={`/ubicaciones/${city.slug}`}
                className="feature-card tilt reveal premium-card location-card"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">
                  <PremiumIcon name="target" size={20} />
                </div>
                <span className="location-tag">{city.tag}</span>
                <h2 className="location-title">{city.name}</h2>
                <p className="location-copy">Centro de operaciones con equipo dedicado, cobertura de eventos y estrategia local de posicionamiento.</p>
                <span className="location-link">
                  Ver detalles
                  <PremiumIcon name="arrow-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .location-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        .location-tag {
          display: inline-flex;
          align-self: flex-start;
          color: #f4cf63;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .location-title {
          margin: 0 0 12px;
          font-family: Cormorant Garamond, serif;
          font-size: 1.6rem;
          color: #f8f5ed;
        }

        .location-copy {
          flex: 1;
          margin: 0 0 20px;
          color: #c9c9c9;
          line-height: 1.7;
        }

        .location-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f4cf63;
          font-weight: 700;
          transition: gap 200ms ease;
        }

        .location-card:hover .location-link {
          gap: 14px;
        }
      `}</style>
    </>
  );
}
