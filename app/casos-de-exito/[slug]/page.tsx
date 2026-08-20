import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { getAllCaseStudies, getCaseStudyBySlug, getCaseStudySchema } from '@/lib/case-studies';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) notFound();

  const schema = getCaseStudySchema(study);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <section className="section-shell" style={{ maxWidth: '900px' }}>
          <Breadcrumb
            items={[
              { name: 'Inicio', href: '/' },
              { name: 'Casos de Éxito', href: '/casos-de-exito' },
              { name: study.title },
            ]}
          />

          <div className="reveal" style={{ marginTop: '24px' }}>
            <div className="eyebrow">{study.industry}</div>
            <h1 className="hero-title" style={{ maxWidth: '20ch', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>{study.title}</h1>
            <p className="hero-copy">{study.challenge}</p>
          </div>

          <section className="panel panel-pad reveal" style={{ marginTop: '40px' }}>
            <h2 className="section-title" style={{ fontSize: '1.6rem', color: '#f4cf63' }}>Estrategia</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {study.strategy.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '10px', color: '#c8c6be', lineHeight: 1.7 }}>
                  <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel-pad reveal" style={{ marginTop: '24px', transitionDelay: '.1s' }}>
            <h2 className="section-title" style={{ fontSize: '1.6rem', color: '#f4cf63' }}>Resultados</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {study.results.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '10px', color: '#c8c6be', lineHeight: 1.7 }}>
                  <span style={{ color: '#f4cf63', flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel-pad reveal" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,15,15,0.98))', transitionDelay: '.2s' }}>
            <h2 className="section-title" style={{ fontSize: '1.6rem', color: '#f4cf63' }}>Testimonio</h2>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', lineHeight: 1.6, fontStyle: 'italic', color: '#f8f5ed' }}>{study.testimonial}</p>
          </section>

          <div className="reveal" style={{ marginTop: '32px' }}>
            <FAQ
              items={[
                { question: '¿Qué se optimizó primero?', answer: 'Arquitectura, contenido, schema y autoridad de marca.' },
                { question: '¿El resultado fue orgánico?', answer: 'Sí, los resultados se construyeron con tráfico y autoridad orgánica.' },
              ]}
            />
          </div>
        </section>
      </main>
    </>
  );
}
