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

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
            {location.city}, {location.region}
          </h1>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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

              <button
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f4cf63',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Agendar Consultoría
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
  } catch {
    notFound();
  }
}
