'use client';

import { organizationSchema } from '@/lib/seo/schema';

export default function UbicacionesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Nuestras Ubicaciones</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Encuentra a Velozza en las principales ciudades de Colombia y Latinoamérica
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
          }}
        >
          {['bogota', 'medellin'].map((city) => (
            <div
              key={city}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3>{city.charAt(0).toUpperCase() + city.slice(1)}</h3>
              <p style={{ color: '#a7a7a7' }}>Centro de operaciones principal</p>
              <a
                href={`/ubicaciones/${city}`}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  color: '#f4cf63',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Ver detalles →
              </a>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
