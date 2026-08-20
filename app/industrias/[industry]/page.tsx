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
    `https://velozzacws.com/industrias/${industry.slug}`
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="section-shell" style={{ maxWidth: '1100px' }}>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Industrias', href: '/industrias' },
            { name: industry.title },
          ]}
        />

        <div className="reveal" style={{ marginTop: '16px' }}>
          <div className="eyebrow">Arquitectura programática</div>
          <h1 className="hero-title" style={{ maxWidth: '18ch', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>{industry.title}</h1>
          <p className="hero-copy">{industry.description}</p>
        </div>

        <section className="panel panel-pad reveal" style={{ marginTop: '30px' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', color: '#f4cf63' }}>Intención de búsqueda</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
            {industry.intent.map((item) => (
              <li key={item} style={{ display: 'flex', gap: '10px', color: '#c8c6be', lineHeight: 1.7 }}>
                <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="reveal" style={{ marginTop: '30px' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Ciudades objetivo</h2>
          <div className="chip-row">
            {industry.cities.map((city) => (
              <Link key={city} href={`/ubicaciones/${city}`} className="chip-button cta-secondary" style={{ color: '#f4cf63' }}>
                {city}
              </Link>
            ))}
          </div>
        </section>

        {industry.painPoints && (
          <section className="panel panel-pad reveal" style={{ marginTop: '30px' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', color: '#f4cf63' }}>Dolores del sector</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {industry.painPoints.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '10px', color: '#c8c6be', lineHeight: 1.7 }}>
                  <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {industry.approach && (
          <section className="reveal" style={{ marginTop: '30px' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Cómo lo aborda Velozza</h2>
            {industry.approach.map((paragraph) => (
              <p key={paragraph} style={{ fontSize: '17px', lineHeight: '1.7', color: '#efe9d6' }}>
                {paragraph}
              </p>
            ))}
          </section>
        )}

        {industry.faqs && (
          <div className="reveal">
            <FAQ title="Preguntas frecuentes del sector" items={industry.faqs} />
          </div>
        )}

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
