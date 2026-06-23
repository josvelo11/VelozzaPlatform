import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQ } from '@/components/seo/FAQ';
import { getCaseStudyBySlug, getCaseStudySchema } from '@/lib/case-studies';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ['brandlift-co', 'law-firm-la'].map((slug) => ({ slug }));
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) notFound();

  const schema = getCaseStudySchema(study);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: 'Casos de Éxito', href: '/casos-de-exito' },
            { name: study.title },
          ]}
        />

        <p style={{ color: '#f4cf63', fontWeight: 700 }}>{study.industry}</p>
        <h1 style={{ fontSize: '40px', marginTop: 0 }}>{study.title}</h1>
        <p style={{ color: '#efe9d6', fontSize: '18px' }}>{study.challenge}</p>

        <section style={{ marginTop: '40px' }}>
          <h2>Estratégia</h2>
          <ul>
            {study.strategy.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2>Resultados</h2>
          <ul>
            {study.results.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section style={{ marginTop: '40px', padding: '24px', background: '#f5f7fb', borderRadius: '12px' }}>
          <h2>Testimonio</h2>
          <p>{study.testimonial}</p>
        </section>

        <FAQ
          items={[
            { question: '¿Qué se optimizó primero?', answer: 'Arquitectura, contenido, schema y autoridad de marca.' },
            { question: '¿El resultado fue orgánico?', answer: 'Sí, los resultados se construyeron con tráfico y autoridad orgánica.' },
          ]}
        />
      </main>
    </>
  );
}
