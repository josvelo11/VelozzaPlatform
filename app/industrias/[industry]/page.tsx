import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { getIndustryBySlug } from '@/lib/industries';
import { serviceSchema } from '@/lib/seo/schema';

interface Props {
  params: Promise<{ industry: string }>;
}

export function generateStaticParams() {
  return ['insurance-agencies', 'realtors'].map((industry) => ({ industry }));
}

export default async function IndustryPage({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);

  if (!industry) notFound();

  const schema = serviceSchema(
    industry.title,
    industry.description,
    '/industry.jpg',
    `https://velozzaworks.com/industrias/${industry.slug}`
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Industrias', href: '/industrias' },
            { name: industry.title },
          ]}
        />

        <p style={{ color: '#f4cf63', fontWeight: 700 }}>Arquitectura programática</p>
        <h1 style={{ fontSize: '40px', marginTop: 0 }}>{industry.title}</h1>
        <p style={{ fontSize: '18px', color: '#efe9d6' }}>{industry.description}</p>

        <section style={{ marginTop: '30px' }}>
          <h2>Intención de búsqueda</h2>
          <ul>
            {industry.intent.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>Ciudades objetivo</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {industry.cities.map((city) => (
              <Link key={city} href={`/ubicaciones/${city}`} style={{ padding: '8px 12px', background: '#f0f0f0', borderRadius: '999px', color: '#333', textDecoration: 'none' }}>
                {city}
              </Link>
            ))}
          </div>
        </section>

        <FAQ
          items={[
            { question: `¿Cómo funciona ${industry.title}?`, answer: 'Creamos landing pages, contenido y autoridad local para captar leads con intención comercial.' },
            { question: '¿Se puede escalar a más ciudades?', answer: 'Sí. La arquitectura está preparada para expandirse a más localidades e industrias.' },
          ]}
        />
      </main>
    </>
  );
}
